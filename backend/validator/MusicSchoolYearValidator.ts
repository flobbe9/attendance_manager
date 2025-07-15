import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { isSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { MUSIC_SCHOOL_YEAR_CONDITIONS, MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS } from "@/utils/attendanceValidationConstants";
import { logDebug, logTrace } from "@/utils/logUtils";
import { assertFalsyAndThrow, cloneObj } from "@/utils/utils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { destructSchoolYearConditions, findSchoolYearConditionsByLessonTopic, isSchoolYearConditionExceedingMax, SchoolYearCondition, sortSchoolYearConditionsByRangeSize } from "../abstract/SchoolYearCondition";
import { SchoolYearConditionOptions } from "../abstract/SchoolYearConditionOptions";
import { isSchoolYearRangeOverlap, schoolYearRangeToString } from "../abstract/SchoolYearRange";
import { AttendanceEntity } from "../DbSchema";

/**
 * @since latest
 */
export class MusicSchoolYearValidator extends AbstractSchoolYearValidator {

    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        super(currentAttendanceEntity, savedAttendanceEntities, "music");
    }
    
    /**
     * @param constantSchoolYearConditions the list of conditions to compare saved attendances against
     * @param options Default for includeCurrentAttendanceEntity is `true`. See {@link SchoolYearConditionOptions}
     * @returns list of conditions with lesson topics that haven't met their required number of attendances yet
     * @throws if falsy params
     */
    public getCurrentlyUnsatisfiedLessonTopicConditions(constantSchoolYearConditions: SchoolYearCondition[], options: SchoolYearConditionOptions = {includeCurrentAttendanceEntity: true}): SchoolYearCondition[] {
        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyUnsatisfiedSchoolYearConditions = cloneObj(constantSchoolYearConditions);
        
        const { includeCurrentAttendanceEntity, dontFilterBySchoolSubjectToValidateFor } = options;

        // get saved attendances to compare conditions 
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(includeCurrentAttendanceEntity);

        if (dontFilterBySchoolSubjectToValidateFor)
            savedAttendances = this.attendanceService.findAllByExaminant(savedAttendances, "music");
        else
            savedAttendances = this.attendanceService.findAllByExaminantAndSchoolSubject(savedAttendances, "music");

        savedAttendances = savedAttendances
            .filter(savedAttendance => 
                isSchoolYear(savedAttendance.schoolYear) && 
                this.attendanceService.isSelectInputFilledOut(savedAttendance.musicLessonTopic));

        savedAttendances
            .forEach(savedAttendance => {                
                const matchingSchoolYearConditionTouples = findSchoolYearConditionsByLessonTopic(savedAttendance.musicLessonTopic, currentlyUnsatisfiedSchoolYearConditions);

                // "subtract" saved attendance conditions from constant conditions
                this.decreaseSchoolYearConditions(matchingSchoolYearConditionTouples, currentlyUnsatisfiedSchoolYearConditions);
            })

        return currentlyUnsatisfiedSchoolYearConditions;
    }

    public validate(schoolYear: SchoolYear): string | null {
        if (!this.shouldInputBeValidated(schoolYear))
            return null;
        
        let errorMessage: string = null;

        logTrace("validate schoolyear", schoolYear)

        if ((errorMessage = this.validateNonContextConditions(MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)) !== null)
            return errorMessage;
        
        logTrace("non context schoolyear valid", schoolYear)

        if ((errorMessage = this.validateContextConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)) !== null)
            return errorMessage;

        logTrace("context schoolyear valid", schoolYear)

        if ((errorMessage = this.validateFuture(schoolYear)) !== null)
            return errorMessage;        

        logTrace("future valid", schoolYear)
        logTrace('')

        return errorMessage;
    }

    /**
     * Assume that `schoolYear` is beeing selected and saved, then try to satisfy all unsatisfied conditions left.
     * Notice that this algorithm wont try all possible combinations 
     * 
     * Also assuming that topic conditions dont have a max value (because I'm too lazy to implement that).
     * @param schoolYear to validate
     * @returns `null` if `inputValue` is valid, an error message if invalid
     */
    public validateFuture(schoolYear: SchoolYear): string | null {
        if (!this.shouldInputBeValidated(schoolYear))
            return null;

        const originalSchoolYear = this.getCurrentAttendance().schoolYear; 
        // simulate that value has been selected
        this.getCurrentAttendance().schoolYear = schoolYear;

        const savedAttendanceFilterOptions: SchoolYearConditionOptions = {
            includeCurrentAttendanceEntity: this.attendanceService.isSelectInputFilledOut(this.getCurrentAttendance().musicLessonTopic)
        }

        const currentlyUnsatisfiedTopicConditions = sortSchoolYearConditionsByRangeSize(
            destructSchoolYearConditions(
                this.getCurrentlyUnsatisfiedLessonTopicConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, savedAttendanceFilterOptions)));

        const schoolYearConditionsWithCount = sortSchoolYearConditionsByRangeSize(
            this.getSchoolYearConditionsWithCountMatchRange(MUSIC_SCHOOL_YEAR_CONDITIONS, savedAttendanceFilterOptions));

        logTrace("required topics", currentlyUnsatisfiedTopicConditions.map(c => c.lessonTopic))
        logTrace("current school year counts", schoolYearConditionsWithCount.map(c => `${schoolYearRangeToString(c.schoolYearRange)}; count: ${c.attendanceCount} - min: ${c.minAttendances} - max: ${c.maxAttendances}`))

        try {
            // find topics that wont satisfy their conditions
            currentlyUnsatisfiedTopicConditions
                .forEach(unsatisfiedTopicCondition => {
                    let hasConditionSchoolYearMatch = false;
                    
                    schoolYearConditionsWithCount
                        .forEach(schoolYearConditionWithCount => {
                            const isRangeOverlap = isSchoolYearRangeOverlap(unsatisfiedTopicCondition.schoolYearRange, schoolYearConditionWithCount.schoolYearRange);

                            // handle distinct schoolyear conditions
                            const doesTopicMatchSchoolYear = 
                                !schoolYearConditionWithCount.isSchoolYearRangeNotDistinct &&
                                schoolYearConditionWithCount.attendanceCount < schoolYearConditionWithCount.maxAttendances && 
                                isRangeOverlap;

                            // case: found a schoolyear match for topic
                            if (doesTopicMatchSchoolYear) {
                                hasConditionSchoolYearMatch = true;
                                schoolYearConditionWithCount.attendanceCount++;
                                // dont stop iterating to count up all matching conditions
                            }

                            // handle overlapping schoolyear conditions (sek1 and sek2)
                            if (isRangeOverlap && schoolYearConditionWithCount.isSchoolYearRangeNotDistinct) {
                                schoolYearConditionWithCount.attendanceCount++;
                                if (isSchoolYearConditionExceedingMax(schoolYearConditionWithCount)) {
                                    logTrace("Will be maxing out sek1 or sek2")
                                    throw new Error(`Das Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(unsatisfiedTopicCondition.lessonTopic)}' wird mit dieser Auswahl nicht seine Mindestanzahl an UBs erreichen können.`);
                                }
                            }
                        })

                    // case: topic does not match with any schoolyear left
                    if (!hasConditionSchoolYearMatch)
                        throw new Error(`Das Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(unsatisfiedTopicCondition.lessonTopic)}' wird mit dieser Auswahl nicht seine Mindestanzahl an UBs erreichen können.`);
                })

            logTrace("future school year counts", schoolYearConditionsWithCount.map(c => `${schoolYearRangeToString(c.schoolYearRange)}; ${c.attendanceCount}`))

        } catch (e) {
            return e.message ?? '';
            
        } finally {
            // reset value
            this.getCurrentAttendance().schoolYear = originalSchoolYear;
        }

        return null;
    }
}
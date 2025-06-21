import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { isSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { MUSIC_SCHOOL_YEAR_CONDITIONS, MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS } from "@/utils/attendanceValidationConstants";
import { logDebug, logTrace } from "@/utils/logUtils";
import { assertFalsyAndThrow, cloneObj } from "@/utils/utils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { destructSchoolYearConditions, findSchoolYearConditionsByLessonTopic, findSchoolYearConditionsBySchoolYearRange, isSchoolYearConditionExceedingMax, SchoolYearCondition, sortSchoolYearConditionsByRangeSize } from "../abstract/SchoolYearCondition";
import { isSchoolYearRangeOverlap, schoolYearRangeToString } from "../abstract/SchoolYearRange";
import { AttendanceEntity } from "../DbSchema";
import { AttendanceService } from "../services/AttendanceService";


/**
 * @since latest
 */
export class MusicSchoolYearValidator extends AbstractSchoolYearValidator {

    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        super(currentAttendanceEntity, savedAttendanceEntities, "music");
    }
    
    public getValidValues(): SchoolYear[] {
        return [];
    }

    /**
     * @param constantSchoolYearConditions the list of conditions to compare saved attendances against
     * @returns list of school year conditions with `minAttendances` beeing the number of attendances left to plan for this school year 
     * in order to match the requirement
     * @throws if falsy params
     */
    public getCurrentlyUnsatisfiedSchoolYearConditions(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyUnsatisfiedSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        // get relevant saved attendances
        const attendanceService = new AttendanceService();
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(true);
        savedAttendances = attendanceService.findAllByExaminant(savedAttendances, "music")
            .filter(savedAttendance => isSchoolYear(savedAttendance.schoolYear));
        
        savedAttendances
            .forEach(savedAttendance => {
                const matchingSchoolYearConditionTouples = findSchoolYearConditionsBySchoolYearRange(savedAttendance.schoolYear, currentlyUnsatisfiedSchoolYearConditions);

                // "subtract" saved attendance conditions from constant conditions
                this.decreaseSchoolYearConditions(matchingSchoolYearConditionTouples, currentlyUnsatisfiedSchoolYearConditions);
            })

        return currentlyUnsatisfiedSchoolYearConditions;
    }


    /**
     * @param constantSchoolYearConditions the list of conditions to compare saved attendances against
     * @param includeCurrent whether to include current (`true`), remove it if saved (`false`) or just return unmodified `savedAttendances` (`null`). Default is `true`
     * @returns list of conditions with lesson topics that haven't met their required number of attendances yet
     * @throws if falsy params
     */
    public getCurrentlyUnsatisfiedLessonTopicConditions(constantSchoolYearConditions: SchoolYearCondition[], includeCurrent: null | boolean = true): SchoolYearCondition[] {
        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyUnsatisfiedSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        // get relevant saved attendances
        const attendanceService = new AttendanceService();
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(includeCurrent);
        savedAttendances = attendanceService.findAllByExaminant(savedAttendances, "music")
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

        logDebug("validate schoolyear", schoolYear)

        if ((errorMessage = this.validateNonContextConditions(MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)) != null)
            return errorMessage;
        
        logDebug("non context schoolyear valid", schoolYear)

        if ((errorMessage = this.validateContextConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)) != null)
            return errorMessage;

        logDebug("context schoolyear valid", schoolYear)

        if ((errorMessage = this.validateFuture(schoolYear)) != null)
            return errorMessage;        

        logDebug("future valid", schoolYear)
        logDebug('')

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

        const includeCurrent = this.attendanceService.isSelectInputFilledOut(this.getCurrentAttendance().musicLessonTopic);

        const currentlyUnsatisfiedTopicConditions = sortSchoolYearConditionsByRangeSize(
            destructSchoolYearConditions(
                this.getCurrentlyUnsatisfiedLessonTopicConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, includeCurrent)));

        const schoolYearConditionsWithCount = sortSchoolYearConditionsByRangeSize(
            this.getSchoolYearConditionsWithCountMatchRange(MUSIC_SCHOOL_YEAR_CONDITIONS, includeCurrent));

        logTrace("required topics", currentlyUnsatisfiedTopicConditions.map(c => c.lessonTopic))
        logTrace("current school year counts", schoolYearConditionsWithCount.map(c => `${schoolYearRangeToString(c.schoolYearRange)}; ${c.attendanceCount}`))

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


    /**
     * Decrease (and modify) `currentlyUnsatisfiedSchoolYearConditions` `minAttendances` or remove the condition if `minAttendances` becomes 0.
     *  
     * @param schoolYearConditionTouples to decrease or remove from `currentlyUnsatisfiedSchoolYearConditions` 
     * @param currentlyUnsatisfiedSchoolYearConditions to update conditions in
     */
    private decreaseSchoolYearConditions(schoolYearConditionTouples: [SchoolYearCondition, number][], currentlyUnsatisfiedSchoolYearConditions: SchoolYearCondition[]): void {

        schoolYearConditionTouples
            // sort in reverse for condition indices not to change when removing conditions
            .sort((condition1, condition2) => condition2[1] - condition1[1])
            .forEach(([matchingSchoolYearCondition, matchingSchoolYearConditionIndex]) => {
                // case: attendance school year has met it 's required amount
                if (!matchingSchoolYearCondition)
                    return;
                
                // case: meeting required amount with this attendance
                if (!matchingSchoolYearCondition.minAttendances || matchingSchoolYearCondition.minAttendances === 1)
                    // remove from conditions array
                    currentlyUnsatisfiedSchoolYearConditions.splice(matchingSchoolYearConditionIndex, 1);
                
                else 
                    matchingSchoolYearCondition.minAttendances--;
            })
    }
}
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { SchoolYear } from "@/abstract/SchoolYear";
import { MUSIC_SCHOOL_YEAR_CONDITIONS, MUSIC_SCHOOL_YEAR_CONDITIONS_NO_SEK, MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS } from "@/utils/attendanceValidationConstants";
import { logDebug } from "@/utils/logUtils";
import { assertFalsyAndThrow, cloneObj } from "@/utils/utils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { destructSchoolYearConditions, findSchoolYearConditionsByLessonTopic, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition, sortSchoolYearConditionsByRangeSize } from "../abstract/SchoolYearCondition";
import { isSchoolYearRangeOverlap, isWithinSchoolYearRange, schoolYearRangeToString } from "../abstract/SchoolYearRange";
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
        savedAttendances = attendanceService.findAllByExaminant(savedAttendances, "music");
        
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
     * @returns list of conditions with lesson topics that haven't met their required number of attendances yet
     * @throws if falsy params
     */
    public getCurrentlyUnsatisfiedLessonTopicConditions(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyUnsatisfiedSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        // get relevant saved attendances
        const attendanceService = new AttendanceService();
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(true);
        savedAttendances = attendanceService.findAllByExaminant(savedAttendances, "music");

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

    
    // ** assuming that topic conditions have no max value
        // gub
        // handle invalid attendances during iteration
            // get condition methods
    public validateFuture(schoolYear: SchoolYear): string | null {

        if (!this.shouldInputBeValidated(schoolYear))
            return null;

        const prevSchoolYear = this.getCurrentAttendance().schoolYear; 
        // pretend value has been selected
        this.getCurrentAttendance().schoolYear = schoolYear;

        let currentlyUnsatisfiedTopicConditions = this.getCurrentlyUnsatisfiedLessonTopicConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);
        currentlyUnsatisfiedTopicConditions = destructSchoolYearConditions(currentlyUnsatisfiedTopicConditions);
        sortSchoolYearConditionsByRangeSize(currentlyUnsatisfiedTopicConditions);

        const schoolYearConditionsWithCount =  this.getSchoolYearConditionsWithCountMatchRange(MUSIC_SCHOOL_YEAR_CONDITIONS_NO_SEK);
        sortSchoolYearConditionsByRangeSize(schoolYearConditionsWithCount);

        logDebug("required topics", currentlyUnsatisfiedTopicConditions.map(c => c.lessonTopic))
        logDebug("current school year counts", schoolYearConditionsWithCount.map(c => `${schoolYearRangeToString(c.schoolYearRange)}; ${c.attendanceCount}`))

        try {
            // find topics that wont satisfy their conditions
            currentlyUnsatisfiedTopicConditions
                .forEach(unsatisfiedTopicCondition => {
                    let hasConditionSchoolYearMatch = !!schoolYearConditionsWithCount
                        .find(schoolYearConditionWithCount => {
                            const doesTopicMatchSchoolYear = 
                                schoolYearConditionWithCount.attendanceCount < schoolYearConditionWithCount.maxAttendances && 
                                isSchoolYearRangeOverlap(unsatisfiedTopicCondition.schoolYearRange, schoolYearConditionWithCount.schoolYearRange);
                            
                            if (doesTopicMatchSchoolYear)
                                schoolYearConditionWithCount.attendanceCount++;

                            return doesTopicMatchSchoolYear;
                        })

                    // case: topic does not match with any schoolyear left
                    if (!hasConditionSchoolYearMatch)
                        throw new Error(`Das Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(unsatisfiedTopicCondition.lessonTopic)}' wird mit dieser Auswahl nicht seine Mindestanzahl an UBs erreichen können.`);
                })

        } catch (e) {
            return e.message ?? '';
            
        } finally {
            // reset value
            this.getCurrentAttendance().schoolYear = prevSchoolYear;
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
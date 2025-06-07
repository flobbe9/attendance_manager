import { SchoolYear } from "@/abstract/SchoolYear";
import { assertFalsyAndThrow, cloneObj } from "@/utils/utils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { findSchoolYearConditionsByLessonTopic, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "../abstract/SchoolYearCondition";
import { AttendanceEntity } from "../DbSchema";
import { logDebug } from "@/utils/logUtils";
import { MUSIC_SCHOOL_YEAR_CONDITIONS, MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS } from "@/utils/attendanceValidationConstants";


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
    public getCurrentlyRequiredSchoolYearConditions(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyRequiredSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        this.getSavedAttendances()
            .forEach(savedAttendance => {
                const matchingSchoolYearConditionTouples = findSchoolYearConditionsBySchoolYearRange(savedAttendance.schoolYear, currentlyRequiredSchoolYearConditions);

                // "subtract" saved attendance conditions from constant conditions
                this.decreaseSchoolYearConditions(matchingSchoolYearConditionTouples, currentlyRequiredSchoolYearConditions);
            })

        return currentlyRequiredSchoolYearConditions;
    }


    /**
     * @param constantSchoolYearConditions the list of conditions to compare saved attendances against
     * @returns list of conditions with lesson topics that haven't met their required number of attendances yet
     * @throws if falsy params
     */
    public getCurrentlyRequiredLessonTopics(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions);

        const currentlyRequiredSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        this.getSavedAttendances()
            .forEach(savedAttendance => {
                const matchingSchoolYearConditionTouples = findSchoolYearConditionsByLessonTopic(savedAttendance.musicLessonTopic, currentlyRequiredSchoolYearConditions);

                // "subtract" saved attendance conditions from constant conditions
                this.decreaseSchoolYearConditions(matchingSchoolYearConditionTouples, currentlyRequiredSchoolYearConditions);
            })

        return currentlyRequiredSchoolYearConditions;
    }


    public validate(schoolYear: SchoolYear): string | null {
        
        let errorMessage: string = null;

        logDebug("validate schoolyear", schoolYear)

        if ((errorMessage = this.validateNonContextConditions(MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)) != null)
            return errorMessage;
        
        logDebug("non context schoolyear valid", schoolYear)

        if ((errorMessage = this.validateContextConditions(MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)) != null)
            return errorMessage;

        logDebug("context schoolyear valid", schoolYear)

        // validatefuture

        return null;
    }


    /**
     * Decrease (and modify) `currentlyRequiredSchoolYearConditions` `minAttendances` or remove the condition if `minAttendances` becomes 0.
     *  
     * @param schoolYearConditionTouples to decrease or remove from `currentlyRequiredSchoolYearConditions` 
     * @param currentlyRequiredSchoolYearConditions to update conditions in
     */
    private decreaseSchoolYearConditions(schoolYearConditionTouples: [SchoolYearCondition, number][], currentlyRequiredSchoolYearConditions: SchoolYearCondition[]): void {

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
                    currentlyRequiredSchoolYearConditions.splice(matchingSchoolYearConditionIndex, 1);
                
                else 
                    matchingSchoolYearCondition.minAttendances--;
            })
    }
}
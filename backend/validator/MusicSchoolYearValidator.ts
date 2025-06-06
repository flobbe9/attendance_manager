import { cloneObj } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "../abstract/SchoolYearCondition";
import { AttendanceEntity } from "../DbSchema";
import { SchoolYear } from "@/abstract/SchoolYear";


/**
 * @since latest
 */
export class MusicSchoolYearValidator extends AbstractSchoolYearValidator {
    
    constructor(currentAttendanceEntity: AttendanceEntity, allAttendanceEntities: AttendanceEntity[]) {
        
        super(currentAttendanceEntity, allAttendanceEntities, "music");
    }
    
    
    public getValidValues(): SchoolYear[] {

        return [];
    }


    /**
     * @param constantSchoolYearConditions the list of conditions to compare saved attendances against
     * @returns list of school year conditions with `minAttendances` beeing the number of attendances left to plan for this school year 
     * in order to match the requirement
     */
    public getCurrentlyRequiredSchoolYearConditions(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        const currentlyRequiredSchoolYearConditions = cloneObj(constantSchoolYearConditions);

        this.getAllAttendances()
            .forEach(savedAttendance => {
                const matchingSchoolYearConditionTouples = findSchoolYearConditionsBySchoolYearRange(savedAttendance.schoolYear, currentlyRequiredSchoolYearConditions);

                matchingSchoolYearConditionTouples
                    .sort((condition1, condition2) => condition2[1] - condition1[1])
                    .forEach(matchingSchoolYearConditionTouple => {
                        
                        const [matchingSchoolYearCondition, matchingSchoolYearConditionIndex] = matchingSchoolYearConditionTouple;

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
            })

        return currentlyRequiredSchoolYearConditions;
    }
}
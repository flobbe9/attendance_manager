import { assertFalsyAndThrow, cloneObj, isStringFalsy } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AttendanceEntity } from "../DbSchema";
import { AbstractAttendanceInputValidator } from "./AbstractAttendanceInputValidator";
import { findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "./SchoolYearCondition";
import { isSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { log, logDebug, logTrace } from "@/utils/logUtils";
import { isWithinSchoolYearRange, schoolYearRangeToString } from "./SchoolYearRange";
import { AttendanceService } from "../services/AttendanceService";


/**
 * @since latest
 */
export abstract class AbstractSchoolYearValidator extends AbstractAttendanceInputValidator<SchoolYear> {

    /** The subject this validator is for. Should be a constant, set by implementing class.  */
    private schoolSubjectToValidateFor: SchoolSubject_Key;


    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[], schoolSubjectToValidateFor: SchoolSubject_Key) {
        
        super(currentAttendanceEntity, savedAttendanceEntities);

        this.schoolSubjectToValidateFor = schoolSubjectToValidateFor;
    }
    

    public abstract getValidValues(): ValueOf<AttendanceEntity>[];
    // iterate left over values
        // validate simple
        // validate with context
        // vlaidate future
        // add to list
    
    
    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @returns list of school year ranges that haven't met their required number of attendances yet. `minAttendances` 
     * represents the number of attendances left to fullfill the requirement
     */
    protected abstract getCurrentlyUnsatisfiedSchoolYearConditions(allConstantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[];

    
    /**
     * @param constantSchoolYearConditions to count up
     * @param countCondition return true when to count up
     * @returns `constantSchoolYearConditions` with updated `attendanceCount`
     * @throws if falsy params
     */
    public getSchoolYearConditionsWithCount(
        constantSchoolYearConditions: SchoolYearCondition[], 
        countCondition: (savedAttendance: AttendanceEntity, condition: SchoolYearCondition) => boolean
    ): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions, countCondition);

        // case: nothing saved yet, nothing to count
        if (!this.getSavedAttendances())
            return constantSchoolYearConditions;

        const conditionsWithCount = cloneObj(constantSchoolYearConditions);

        // get relevant saved attendances
        const attendanceService = new AttendanceService();
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(true);
        savedAttendances = attendanceService.findAllByExaminant(savedAttendances, "music");

        savedAttendances
            .forEach(savedAttendance => {
                conditionsWithCount
                    .forEach(condition => {
                        if (countCondition(savedAttendance, condition)) {
                            if (!condition.attendanceCount)
                                condition.attendanceCount = 0;

                            condition.attendanceCount++;
                        }
                    })
            })

        return conditionsWithCount;
    }


    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions
     */
    public validateNonContextConditions(allConstantSchoolYearConditions: SchoolYearCondition[], schoolYear: SchoolYear): string | null {

        if (!this.shouldInputBeValidated(schoolYear))
            return null;

        assertFalsyAndThrow(allConstantSchoolYearConditions);

        // should be validated
            // truthy input
            // right schoolsubject ((assume truthy))
            // has matching examinant
        if (!schoolYear || this.getCurrentAttendance().schoolSubject !== this.schoolSubjectToValidateFor)
            return null;

        const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(schoolYear, allConstantSchoolYearConditions);
        const attendanceService = new AttendanceService();

        for (const [schoolYearCondition, ] of schoolYearConditions) {
            // get relevant saved attendances
            let savedAttendances = this.getSavedAttendancesBySchoolSubject(this.schoolSubjectToValidateFor);
            savedAttendances = attendanceService.findAllByExaminant(savedAttendances, this.schoolSubjectToValidateFor);
            
            // count saved attendances within this school year range
            const numSavedAttendancesBySchoolYearRange = savedAttendances
                .filter(attendance => isWithinSchoolYearRange(attendance.schoolYear, schoolYearCondition.schoolYearRange))
                .length;

            // case: range maxed out
            if (numSavedAttendancesBySchoolYearRange === schoolYearCondition.maxAttendances)
                return `Für die Jahrgänge '${schoolYearRangeToString(schoolYearCondition.schoolYearRange)}' sind im ausgewählten Fach bereits die maximale Anzahl an UBs geplant (${schoolYearCondition.maxAttendances}x).`;
        }

        return null;
    }


    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions
     */
    public validateContextConditions(allConstantSchoolYearConditions: SchoolYearCondition[], schoolYear: SchoolYear): string | null {

        if (!this.shouldInputBeValidated(schoolYear))
            return null;
        
        assertFalsyAndThrow(allConstantSchoolYearConditions);

        if (!schoolYear || this.getCurrentAttendance().schoolSubject !== this.schoolSubjectToValidateFor)
            return null;

        const lessonTopic = this.getCurrentAttendance().musicLessonTopic;

        if (!lessonTopic)
            return null;

        const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(schoolYear, allConstantSchoolYearConditions);

        // case: no conditions for this schoolyear in the first place, dont validate topic
        if (!schoolYearConditions.length)
            return null;

        const schoolYearConditionWithTopicMatch = schoolYearConditions
            .find(([schoolYearCondition, ]) => schoolYearCondition.lessonTopic === lessonTopic)

        if (!schoolYearConditionWithTopicMatch)
            return `Die Kombination aus Jahrgang '${schoolYear}' und Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(lessonTopic)}' ist nicht möglich.`;
            
        return null;
    }


    public shouldInputBeValidated(inputValue: SchoolYear): boolean {
        
        return isSchoolYear(inputValue) && 
            this.getCurrentAttendance().schoolSubject === this.schoolSubjectToValidateFor && 
            this.attendanceService.hasExaminant(this.getCurrentAttendance(), this.schoolSubjectToValidateFor);
    }
} 
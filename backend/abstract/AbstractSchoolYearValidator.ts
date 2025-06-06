import { assertFalsyAndThrow } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AttendanceEntity } from "../DbSchema";
import { AbstractAttendanceValidator } from "./AbstractAttendanceValidator";
import { findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "./SchoolYearCondition";
import { SchoolYear } from "@/abstract/SchoolYear";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";


/**
 * @since latest
 */
export abstract class AbstractSchoolYearValidator extends AbstractAttendanceValidator {

    /** The subject this validator is for. Should be a constant, set by implementing class.  */
    private schoolSubjectToValidateFor: SchoolSubject_Key;


    constructor(currentAttendanceEntity: AttendanceEntity, allAttendanceEntities: AttendanceEntity[], schoolSubjectToValidateFor: SchoolSubject_Key) {
        
        super(currentAttendanceEntity, allAttendanceEntities);

        this.schoolSubjectToValidateFor = schoolSubjectToValidateFor;
    }
    

    public abstract getValidValues(): ValueOf<AttendanceEntity>[];
    // iterate left over values
        // validate simple
        // validate with context
        // vlaidate future
        // add to list


    // getCurrentlyRequiredTopics
    
    
    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @returns list of school year ranges that haven't met their required number of attendances yet. `minAttendances` 
     * represents the number of attendances left to fullfill the requirement
     */
    protected abstract getCurrentlyRequiredSchoolYearConditions(allConstantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[];


    /**
     * Validate `schoolYear`s conditions that don't take other attendance fields or future selections into consideration.
     * 
     * Returned error message gives a brief reason why `schoolYear` is invalid. Wont list possible values. Will include the invalid value.
     * 
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid, an error message if invalid
     * @throws if falsy params
     */
    public validateNonContextConditions(allConstantSchoolYearConditions: SchoolYearCondition[], schoolYear: SchoolYear): string | null {

        assertFalsyAndThrow(allConstantSchoolYearConditions, schoolYear);

        if (this.getCurrentAttendance().schoolSubject !== this.schoolSubjectToValidateFor)
            return null;

        const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(schoolYear, allConstantSchoolYearConditions);
        const numSavedAttendancesBySchoolYear = this.getAllAttendancesBySchoolSubject(this.schoolSubjectToValidateFor)
            .filter(attendance => attendance.schoolYear === schoolYear)
            .length;

        for (const [schoolYearCondition, ] of schoolYearConditions)
            if (numSavedAttendancesBySchoolYear === schoolYearCondition.maxAttendances)
                return `Für Jahrgang '${schoolYear}' sind im ausgewählten Fach bereits die maximale Anzahl an UBs geplant (${schoolYearCondition.maxAttendances}x)`;

        return null;
    }

    
    /**
     * Validate `schoolYear` only considering conditions that are related to other attendance fields (not including future selections).
     * 
     * @param allConstantSchoolYearConditions 
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid, an error message if invalid
     * @throws if falsy params
     */
    public validateContextConditions(allConstantSchoolYearConditions: SchoolYearCondition[], schoolYear: SchoolYear): string | null {

        assertFalsyAndThrow(allConstantSchoolYearConditions, schoolYear);

        if (this.getCurrentAttendance().schoolSubject !== this.schoolSubjectToValidateFor)
            return null;

        const lessonTopic = this.getCurrentAttendance().musicLessonTopic;

        if (!lessonTopic)
            return null;

        const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(schoolYear, allConstantSchoolYearConditions);

        // case: no conditions for this schoolyear in the first place, dont validate topic
        if (!schoolYearConditions.length)
            return null;

        const schoolYearConditionWithTopicMatch = schoolYearConditions
            .find(([schoolYearCondition, ]) => schoolYearCondition.topic === lessonTopic)

        if (!schoolYearConditionWithTopicMatch)
            return `Die Kombination aus Jahrgang '${schoolYear}' und Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(lessonTopic)}' ist nicht möglich.`;
            
        return null;
    }
} 
import { assertFalsyAndThrow } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AttendanceEntity } from "../DbSchema";
import { AbstractAttendanceInputValidator } from "./AbstractAttendanceInputValidator";
import { findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "./SchoolYearCondition";
import { SchoolYear } from "@/abstract/SchoolYear";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { log, logDebug, logTrace } from "@/utils/logUtils";
import { isWithinSchoolYearRange, schoolYearRangeToString } from "./SchoolYearRange";


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
    protected abstract getCurrentlyRequiredSchoolYearConditions(allConstantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[];


    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions
     */
    public validateNonContextConditions(allConstantSchoolYearConditions: SchoolYearCondition[], schoolYear: SchoolYear): string | null {

        assertFalsyAndThrow(allConstantSchoolYearConditions);

        if (!schoolYear || this.getCurrentAttendance().schoolSubject !== this.schoolSubjectToValidateFor)
            return null;

        const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(schoolYear, allConstantSchoolYearConditions);

        for (const [schoolYearCondition, ] of schoolYearConditions) {
            // count saved attendances within this school year range
            const numSavedAttendancesBySchoolYearRange = this.getSavedAttendancesBySchoolSubject(this.schoolSubjectToValidateFor)
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
} 
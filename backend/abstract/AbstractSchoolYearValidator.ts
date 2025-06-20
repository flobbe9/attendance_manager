import { assertFalsyAndThrow, cloneObj, isStringFalsy } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AttendanceEntity } from "../DbSchema";
import { AbstractAttendanceInputValidator } from "./AbstractAttendanceInputValidator";
import { destructSchoolYearConditions, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "./SchoolYearCondition";
import { isSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { getSchoolSubjectBySchoolSubjectKey, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { log, logDebug, logTrace } from "@/utils/logUtils";
import { isWithinSchoolYearRange, schoolYearRangeToString } from "./SchoolYearRange";
import { AttendanceService } from "../services/AttendanceService";
import { getGubSubjectSchoolYearConditionsBySubject, getTotalRequiredGubs, GUB_SCHOOL_YEAR_CONDITIONS } from "@/utils/attendanceValidationConstants";


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
     * @param constantSchoolYearConditions to count up (wont be modified)
     * @param countCondition return true when to count up
     * @param includeCurrent whether to include current (`true`), remove it if saved (`false`) or just return unmodified `savedAttendances` (`null`). Default is `true`
     * @returns `constantSchoolYearConditions` with updated `attendanceCount`
     * @throws if falsy params
     */
    public getSchoolYearConditionsWithCount(
        constantSchoolYearConditions: SchoolYearCondition[], 
        countCondition: (savedAttendance: AttendanceEntity, condition: SchoolYearCondition) => boolean,
        includeCurrent: boolean | null = true
    ): SchoolYearCondition[] {

        assertFalsyAndThrow(constantSchoolYearConditions, countCondition);

        // case: nothing saved yet, nothing to count
        if (!this.getSavedAttendances())
            return constantSchoolYearConditions;

        const conditionsWithCount = cloneObj(constantSchoolYearConditions);

        // get relevant saved attendances
        const attendanceService = new AttendanceService();
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(includeCurrent);
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
     * See {@link getSchoolYearConditionsWithCount}. Count up all condtions where the saved attendance schoolYear is within the condition's schoolYearRange.
     * 
     * @param constantSchoolYearConditions to count up (wont be modified)
     * @returns `constantSchoolYearConditions` with updated `attendanceCount`
     * @throws if falsy params
     */
    protected getSchoolYearConditionsWithCountMatchRange(constantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {

        return this.getSchoolYearConditionsWithCount(
            constantSchoolYearConditions, 
            (savedAttendance, condition) => 
                isWithinSchoolYearRange(savedAttendance.schoolYear, condition.schoolYearRange)
        );
    }


    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions are falsy
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
     * @throws if conditions are falsy
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

        let errorMessage: string | null = null;

        if (!schoolYearConditionWithTopicMatch)
            errorMessage = `Die Kombination aus Jahrgang '${schoolYear}' und Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(lessonTopic)}' ist nicht möglich.`;
        
        else
            errorMessage = this.validateGubs(schoolYear);
        
        return errorMessage;
    }


    /**
     * Validate the gub conditions taking saved attendances into account.
     * 
     * Dont validate if `currentAttendance` is not a gub.
     * 
     * Does not validate the future as it should always be possible to make a saved attendance a gub.
     * 
     * @param schoolYear to validate 
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @see isGub()
     */
    public validateGubs(schoolYear: SchoolYear): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance()))
            return null;
        
        const originalSchoolYear = this.getCurrentAttendance().schoolYear;
        this.getCurrentAttendance().schoolYear = schoolYear;

        let errorMessage: string | null = null;
        try {
            if ((errorMessage = this.validateGubTotal()) !== null)
                return errorMessage;
            
            if (schoolYear && (errorMessage = this.validateGubSchoolYearConditions()) !== null)
                return errorMessage;
            
            if (schoolYear && (errorMessage = this.validateGubSubjectSchoolYearConditions()) !== null)
                return errorMessage;

        } finally {
            this.getCurrentAttendance().schoolYear = originalSchoolYear;
        }

        return errorMessage;
    }


    private validateGubTotal(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance()))
            return null;

        try {
            const totalNumRequiredGubs = getTotalRequiredGubs();
            let gubCount = 0;
            this.getSavedAttendancesWithoutCurrent()
                .forEach(savedAttendance => {
                    if (this.attendanceService.isGub(savedAttendance))
                        gubCount++;

                    if (gubCount === totalNumRequiredGubs)
                        throw new Error(`Du has bereits all GUBs geplant (${totalNumRequiredGubs}x). Entferne mindestens einen GUB relevanten Prüfer.`);
                })
        
        } catch (e) {
            return e.message;
        }

        return null;
    }

    private validateGubSchoolYearConditions(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance()))
            return null;

        try {
            const gubConditionsWithCount = destructSchoolYearConditions(this.getSchoolYearConditionsWithCount(
                GUB_SCHOOL_YEAR_CONDITIONS,
                (savedAttendance: AttendanceEntity, schoolYearCondition: SchoolYearCondition) => {
                    const isGub = this.attendanceService.isGub(savedAttendance);
                    const isSchoolYearWithinRange = isWithinSchoolYearRange(savedAttendance.schoolYear, schoolYearCondition.schoolYearRange);
    
                    return isGub && isSchoolYearWithinRange; 
                },
                true
            ));

            for (const gubCondition of gubConditionsWithCount)
                if (gubCondition.attendanceCount > gubCondition.maxAttendances)
                    throw new Error(`Du hast bereits alle GUBs für die Jahrgänge ${schoolYearRangeToString(gubCondition.schoolYearRange)
                        } geplant (${gubCondition.maxAttendances}x). Entferne mindestens einen GUB relevanten Prüfer oder wähle einen anderen Jahrgang.`);

        } catch (e) {
            return e.message;
        }

        return null;
    }

    private validateGubSubjectSchoolYearConditions(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance()))
            return null;

        try {
            // validate gub subject conditions
            const gubSubjectConditionsWithCount = destructSchoolYearConditions(this.getSchoolYearConditionsWithCount(
                getGubSubjectSchoolYearConditionsBySubject(this.schoolSubjectToValidateFor),
                (savedAttendance: AttendanceEntity, schoolYearCondition: SchoolYearCondition) => {
                    const isGub = this.attendanceService.isGub(savedAttendance);
                    const isSchoolYearWithinRange = isWithinSchoolYearRange(savedAttendance.schoolYear, schoolYearCondition.schoolYearRange);
                    const isSameSubject = savedAttendance.schoolSubject === this.schoolSubjectToValidateFor;

                    return isGub && isSchoolYearWithinRange && isSameSubject;
                }
            ));

            for (const gubCondition of gubSubjectConditionsWithCount)
                if (gubCondition.attendanceCount > gubCondition.maxAttendances)
                    throw new Error(`Du hast bereits alle GUBs für das Fach '${getSchoolSubjectBySchoolSubjectKey(this.schoolSubjectToValidateFor)
                        }' (${gubCondition.maxAttendances}x) geplant. Entferne mindestens einen GUB relevanten Prüfer oder wähle ein anderes Fach aus.`);

        } catch (e) {
            return e.message;
        }

        return null;
    }

    public shouldInputBeValidated(inputValue: SchoolYear): boolean {
        return isSchoolYear(inputValue) && 
            this.getCurrentAttendance().schoolSubject === this.schoolSubjectToValidateFor && 
            this.attendanceService.hasExaminant(this.getCurrentAttendance(), this.schoolSubjectToValidateFor);
    }
} 
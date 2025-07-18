import {getMusicLessonTopicByMusicLessonTopicKey} from "@/abstract/MusicLessonTopic";
import {getSchoolSubjectBySchoolSubjectKey, SchoolSubject_Key} from "@/abstract/SchoolSubject";
import {isSchoolYear, SCHOOL_YEARS, SchoolYear} from "@/abstract/SchoolYear";
import {
    getGubSubjectSchoolYearConditionsBySubject,
    getTotalRequiredGubs,
    GUB_SCHOOL_YEAR_CONDITIONS,
} from "@/utils/attendanceValidationConstants";
import {assertFalsyAndThrow, cloneObj} from "@/utils/utils";
import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {AttendanceEntity} from "../entities/AttendanceEntity";
import {AbstractAttendanceInputValidator} from "./AbstractAttendanceInputValidator";
import {
    destructSchoolYearConditions,
    findSchoolYearConditionsBySchoolYearRange,
    SchoolYearCondition,
} from "./SchoolYearCondition";
import {SchoolYearConditionOptions} from "./SchoolYearConditionOptions";
import {isWithinSchoolYearRange, schoolYearRangeToString} from "./SchoolYearRange";

/**
 * @since 0.1.0
 */
export abstract class AbstractSchoolYearValidator extends AbstractAttendanceInputValidator<SchoolYear> {
    /** The subject this validator is for. Should be a constant, set by implementing class.  */
    private schoolSubjectToValidateFor: SchoolSubject_Key;

    constructor(
        currentAttendanceEntity: AttendanceEntity,
        savedAttendanceEntities: AttendanceEntity[],
        schoolSubjectToValidateFor: SchoolSubject_Key
    ) {
        super(currentAttendanceEntity, savedAttendanceEntities);

        this.schoolSubjectToValidateFor = schoolSubjectToValidateFor;
    }

    /**
     * Validate all possible school year values (non-context, context and future) and return the valid ones.
     *
     * @returns all school years valid at this moment or an empty array
     */
    public getValidValues(): ValueOf<AttendanceEntity>[] {
        return SCHOOL_YEARS.filter((schoolYear) => this.validate(schoolYear) === null);
    }

    public getInvalidValues(): ValueOf<AttendanceEntity>[] {
        // not needed right now
        return [];
    }

    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param options Default for includeCurrentAttendanceEntity is `true`. See {@link SchoolYearConditionOptions}
     * @returns list of school year ranges that haven't met their required number of attendances yet. `minAttendances`
     * represents the number of attendances left to fullfill the requirement
     * @throws if falsy param
     */
    public getCurrentlyUnsatisfiedSchoolYearConditions(
        allConstantSchoolYearConditions: SchoolYearCondition[],
        options: SchoolYearConditionOptions = {includeCurrentAttendanceEntity: true}
    ): SchoolYearCondition[] {
        assertFalsyAndThrow(allConstantSchoolYearConditions);

        const currentlyUnsatisfiedSchoolYearConditions = cloneObj(allConstantSchoolYearConditions);

        // get relevant saved attendances
        let savedAttendances =
            this.getSavedAttendanceEntitiesFilteredBySchoolYearConditions(options);
        savedAttendances = savedAttendances.filter((savedAttendance) =>
            isSchoolYear(savedAttendance.schoolYear)
        );

        savedAttendances.forEach((savedAttendance) => {
            const matchingSchoolYearConditionTouples = findSchoolYearConditionsBySchoolYearRange(
                savedAttendance.schoolYear,
                currentlyUnsatisfiedSchoolYearConditions
            );

            // "subtract" saved attendance conditions from constant conditions
            this.decreaseSchoolYearConditions(
                matchingSchoolYearConditionTouples,
                currentlyUnsatisfiedSchoolYearConditions
            );
        });

        return currentlyUnsatisfiedSchoolYearConditions;
    }

    /**
     * @param constantSchoolYearConditions to count up (wont be modified)
     * @param countCondition return true when to count up
     * @param options default for includeCurrentAttendanceEntity is `true`. See {@link SchoolYearConditionOptions}
     * @returns `constantSchoolYearConditions` with updated `attendanceCount`
     * @throws if falsy params
     */
    public getSchoolYearConditionsWithCount(
        constantSchoolYearConditions: SchoolYearCondition[],
        countCondition: (
            savedAttendance: AttendanceEntity,
            condition: SchoolYearCondition
        ) => boolean,
        options: SchoolYearConditionOptions = {includeCurrentAttendanceEntity: true}
    ): SchoolYearCondition[] {
        assertFalsyAndThrow(constantSchoolYearConditions, countCondition);

        // case: nothing saved yet, nothing to count
        if (!this.getSavedAttendances()) return constantSchoolYearConditions;

        const conditionsWithCount = cloneObj(constantSchoolYearConditions);

        let savedAttendances =
            this.getSavedAttendanceEntitiesFilteredBySchoolYearConditions(options);
        savedAttendances = savedAttendances.filter((savedAttendance) =>
            isSchoolYear(savedAttendance.schoolYear)
        );

        savedAttendances.forEach((savedAttendance) => {
            conditionsWithCount.forEach((condition) => {
                if (countCondition(savedAttendance, condition)) {
                    if (!condition.attendanceCount) condition.attendanceCount = 0;

                    condition.attendanceCount++;
                }
            });
        });

        return conditionsWithCount;
    }

    /**
     * See {@link getSchoolYearConditionsWithCount}. Count up all condtions where the saved attendance schoolYear is within the condition's schoolYearRange.
     *
     * @param constantSchoolYearConditions to count up (wont be modified)
     * @param options default for includeCurrentAttendanceEntity is `true`. See {@link SchoolYearConditionOptions}
     * @returns `constantSchoolYearConditions` with updated `attendanceCount`
     * @throws if falsy params
     */
    protected getSchoolYearConditionsWithCountMatchRange(
        constantSchoolYearConditions: SchoolYearCondition[],
        options: SchoolYearConditionOptions = {includeCurrentAttendanceEntity: true}
    ): SchoolYearCondition[] {
        return this.getSchoolYearConditionsWithCount(
            constantSchoolYearConditions,
            (savedAttendance, condition) =>
                isSchoolYear(savedAttendance.schoolYear) &&
                isWithinSchoolYearRange(savedAttendance.schoolYear, condition.schoolYearRange),
            options
        );
    }

    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions are falsy
     */
    public validateNonContextConditions(
        allConstantSchoolYearConditions: SchoolYearCondition[],
        schoolYear: SchoolYear
    ): string | null {
        if (!this.shouldInputBeValidated(schoolYear)) return null;

        assertFalsyAndThrow(allConstantSchoolYearConditions);

        const schoolYearConditionsWithCount = this.getSchoolYearConditionsWithCountMatchRange(
            findSchoolYearConditionsBySchoolYearRange(
                schoolYear,
                allConstantSchoolYearConditions
            ).map(([condition]) => condition),
            {includeCurrentAttendanceEntity: false}
        );

        // case: range maxed out
        for (const schoolYearConditionWithCount of schoolYearConditionsWithCount)
            if (
                schoolYearConditionWithCount.attendanceCount >=
                schoolYearConditionWithCount.maxAttendances
            )
                return `Für die Jahrgänge '${schoolYearRangeToString(
                    schoolYearConditionWithCount.schoolYearRange
                )}' sind im ausgewählten Fach bereits die maximale Anzahl an UBs geplant (${
                    schoolYearConditionWithCount.maxAttendances
                }x).`;

        return null;
    }

    /**
     * @param allConstantSchoolYearConditions the constant list to compare saved attendances agains. See "attendanceValidationConstants.ts"
     * @param schoolYear to validate
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @throws if conditions are falsy
     */
    public validateContextConditions(
        allConstantSchoolYearConditions: SchoolYearCondition[],
        schoolYear: SchoolYear
    ): string | null {
        if (!this.shouldInputBeValidated(schoolYear)) return null;

        assertFalsyAndThrow(allConstantSchoolYearConditions);

        let errorMessage: string | null = null;

        const lessonTopic = this.getCurrentAttendance().musicLessonTopic;

        // case: got lesson topic to validate
        if (this.attendanceService.isSelectInputFilledOut(lessonTopic)) {
            const schoolYearConditions = findSchoolYearConditionsBySchoolYearRange(
                schoolYear,
                allConstantSchoolYearConditions
            );

            if (schoolYearConditions.length) {
                const schoolYearConditionWithTopicMatch = schoolYearConditions.find(
                    ([schoolYearCondition]) => schoolYearCondition.lessonTopic === lessonTopic
                );

                // case: no schoolyear left for selected topic
                if (!schoolYearConditionWithTopicMatch)
                    errorMessage = `Die Kombination aus Jahrgang '${schoolYear}' und Stundenthema '${getMusicLessonTopicByMusicLessonTopicKey(
                        lessonTopic
                    )}' ist nicht möglich.`;
            }
        }

        if (errorMessage === null) errorMessage = this.validateGubs(schoolYear);

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
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        const originalSchoolYear = this.getCurrentAttendance().schoolYear;
        this.getCurrentAttendance().schoolYear = schoolYear;

        let errorMessage: string | null = null;
        try {
            if ((errorMessage = this.validateGubTotal()) !== null) return errorMessage;

            if (
                isSchoolYear(schoolYear) &&
                (errorMessage = this.validateGubSchoolYearConditions()) !== null
            )
                return errorMessage;

            if (
                isSchoolYear(schoolYear) &&
                (errorMessage = this.validateGubSubjectSchoolYearConditions()) !== null
            )
                return errorMessage;
        } finally {
            this.getCurrentAttendance().schoolYear = originalSchoolYear;
        }

        return errorMessage;
    }

    private validateGubTotal(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        try {
            const totalNumRequiredGubs = getTotalRequiredGubs();
            let gubCount = 0;
            this.getSavedAttendancesWithoutCurrent().forEach((savedAttendance) => {
                if (this.attendanceService.isGub(savedAttendance)) gubCount++;

                if (gubCount === totalNumRequiredGubs)
                    throw new Error(
                        `Du has bereits all GUBs geplant (${totalNumRequiredGubs}x). Entferne mindestens einen GUB relevanten Prüfer.`
                    );
            });
        } catch (e) {
            return e.message;
        }

        return null;
    }

    private validateGubSchoolYearConditions(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        try {
            const gubConditionsWithCount = destructSchoolYearConditions(
                this.getSchoolYearConditionsWithCount(
                    GUB_SCHOOL_YEAR_CONDITIONS,
                    (
                        savedAttendance: AttendanceEntity,
                        schoolYearCondition: SchoolYearCondition
                    ) => {
                        const isGub = this.attendanceService.isGub(savedAttendance);
                        const isSchoolYearWithinRange = isWithinSchoolYearRange(
                            savedAttendance.schoolYear,
                            schoolYearCondition.schoolYearRange
                        );

                        return isGub && isSchoolYearWithinRange;
                    },
                    {
                        includeCurrentAttendanceEntity: true,
                        dontFilterBySchoolSubjectToValidateFor: true,
                    }
                )
            );

            for (const gubCondition of gubConditionsWithCount)
                if (gubCondition.attendanceCount > gubCondition.maxAttendances)
                    throw new Error(
                        `Du hast bereits alle GUBs für die Jahrgänge ${schoolYearRangeToString(
                            gubCondition.schoolYearRange
                        )} geplant (${
                            gubCondition.maxAttendances
                        }x). Entferne mindestens einen GUB relevanten Prüfer oder wähle einen anderen Jahrgang.`
                    );
        } catch (e) {
            return e.message;
        }

        return null;
    }

    private validateGubSubjectSchoolYearConditions(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        try {
            // validate gub subject conditions
            const gubSubjectConditionsWithCount = destructSchoolYearConditions(
                this.getSchoolYearConditionsWithCount(
                    getGubSubjectSchoolYearConditionsBySubject(this.schoolSubjectToValidateFor),
                    (
                        savedAttendance: AttendanceEntity,
                        schoolYearCondition: SchoolYearCondition
                    ) => {
                        const isGub = this.attendanceService.isGub(savedAttendance);
                        const isSchoolYearWithinRange = isWithinSchoolYearRange(
                            savedAttendance.schoolYear,
                            schoolYearCondition.schoolYearRange
                        );
                        const isSameSubject =
                            savedAttendance.schoolSubject === this.schoolSubjectToValidateFor;

                        return isGub && isSchoolYearWithinRange && isSameSubject;
                    },
                    {
                        includeCurrentAttendanceEntity: true,
                        dontFilterBySchoolSubjectToValidateFor: true,
                    }
                )
            );

            for (const gubCondition of gubSubjectConditionsWithCount)
                if (gubCondition.attendanceCount > gubCondition.maxAttendances)
                    throw new Error(
                        `Du hast bereits alle GUBs für das Fach '${getSchoolSubjectBySchoolSubjectKey(
                            this.schoolSubjectToValidateFor
                        )}' (${
                            gubCondition.maxAttendances
                        }x) geplant. Entferne mindestens einen GUB relevanten Prüfer oder wähle ein anderes Fach aus.`
                    );
        } catch (e) {
            return e.message;
        }

        return null;
    }

    /**
     * @param inputValue
     * @returns `true` if inputValue is a schoolYear, the current subject matches the one to validate for and has a matching examinant
     */
    public shouldInputBeValidated(inputValue: SchoolYear): boolean {
        return (
            isSchoolYear(inputValue) &&
            this.getCurrentAttendance().schoolSubject === this.schoolSubjectToValidateFor &&
            this.attendanceService.hasExaminant(
                this.getCurrentAttendance(),
                this.schoolSubjectToValidateFor
            )
        );
    }

    /**
     * Decrease (and modify) `currentlyUnsatisfiedSchoolYearConditions` `minAttendances` or remove the condition if `minAttendances` becomes 0.
     *
     * @param schoolYearConditionTouples to decrease or remove from `currentlyUnsatisfiedSchoolYearConditions`
     * @param currentlyUnsatisfiedSchoolYearConditions to update conditions in
     */
    protected decreaseSchoolYearConditions(
        schoolYearConditionTouples: [SchoolYearCondition, number][],
        currentlyUnsatisfiedSchoolYearConditions: SchoolYearCondition[]
    ): void {
        schoolYearConditionTouples
            // sort in reverse for condition indices not to change when removing conditions
            .sort((condition1, condition2) => condition2[1] - condition1[1])
            .forEach(([matchingSchoolYearCondition, matchingSchoolYearConditionIndex]) => {
                // case: attendance school year has met it 's required amount
                if (!matchingSchoolYearCondition) return;

                // case: meeting required amount with this attendance
                if (
                    !matchingSchoolYearCondition.minAttendances ||
                    matchingSchoolYearCondition.minAttendances === 1
                )
                    // remove from conditions array
                    currentlyUnsatisfiedSchoolYearConditions.splice(
                        matchingSchoolYearConditionIndex,
                        1
                    );
                else matchingSchoolYearCondition.minAttendances--;
            });
    }

    private getSavedAttendanceEntitiesFilteredBySchoolYearConditions(
        options: SchoolYearConditionOptions
    ): AttendanceEntity[] {
        assertFalsyAndThrow(options);

        const {includeCurrentAttendanceEntity, dontFilterBySchoolSubjectToValidateFor} = options;

        // get relevant saved attendances
        let savedAttendances = this.getSavedAttendancesWithOrWithoutCurrent(
            includeCurrentAttendanceEntity
        );
        if (dontFilterBySchoolSubjectToValidateFor)
            savedAttendances = this.attendanceService.findAllByExaminant(
                savedAttendances,
                this.schoolSubjectToValidateFor
            );
        else
            savedAttendances = this.attendanceService.findAllByExaminantAndSchoolSubject(
                savedAttendances,
                this.schoolSubjectToValidateFor
            );

        return savedAttendances;
    }
}

import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {AbstractSchoolYearValidator} from "../abstract/AbstractSchoolYearValidator";
import {
    isSchoolYearConditionExceedingMax,
    SchoolYearCondition,
} from "../abstract/SchoolYearCondition";
import {AttendanceEntity} from "../entities/AttendanceEntity";
import {isSchoolYear, SchoolYear} from "@/abstract/SchoolYear";
import {
    HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_1,
    HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_2,
    MUSIC_SCHOOL_YEAR_CONDITIONS,
    MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS,
} from "@/utils/attendanceValidationConstants";
import {logDebug, logTrace} from "@/utils/logUtils";
import {assertFalsyAndThrow, isStringFalsy} from "@/utils/utils";
import {schoolYearRangeToString} from "../abstract/SchoolYearRange";

/**
 * @since 0.1.0
 */
export class HistorySchoolYearValidator extends AbstractSchoolYearValidator {
    constructor(
        currentAttendanceEntity: AttendanceEntity,
        savedAttendanceEntities: AttendanceEntity[]
    ) {
        super(currentAttendanceEntity, savedAttendanceEntities, "history");
    }

    public validateFuture(inputValue: SchoolYear): string | null {
        // not implemented
        return null;
    }

    public validate(schoolYear: SchoolYear): string | null {
        if (!this.shouldInputBeValidated(schoolYear)) return null;

        let errorMessageVariant1: string = null;
        let errorMessageVariant2: string = null;

        logTrace("validate schoolyear", schoolYear);

        if (
            (errorMessageVariant1 = this.validateNonContextConditions(
                HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_1,
                schoolYear
            )) !== null
        )
            errorMessageVariant2 = this.validateNonContextConditions(
                HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_2,
                schoolYear
            );
        // case: neither variant is valid
        if (errorMessageVariant1 !== null && errorMessageVariant2 !== null)
            return this.concatErrorMessages(errorMessageVariant1, errorMessageVariant2);
        logTrace("non context schoolyear valid", schoolYear);

        // not passing conditions since history needs to handle multiple condition lists
        if ((errorMessageVariant1 = this.validateContextConditions([], schoolYear)) !== null)
            return errorMessageVariant1;
        logTrace("context schoolyear valid", schoolYear);

        if ((errorMessageVariant1 = this.validateFuture(schoolYear)) !== null)
            return errorMessageVariant1;
        logTrace("future valid", schoolYear);
        logTrace("");

        return this.concatErrorMessages(errorMessageVariant1, errorMessageVariant2);
    }

    /**
     * Make sure that saved history attendances only match one condition list variant. Also validate gubs.
     *
     * @param allConstantSchoolYearConditions not used by this method, see "attendanceValidationConstants.ts" instead
     * @param schoolYear to validate
     * @returns `null` if `inputValue` is valid, an error message if invalid
     */
    public validateContextConditions(
        allConstantSchoolYearConditions: SchoolYearCondition[],
        schoolYear: SchoolYear
    ): string | null {
        if (!isSchoolYear(schoolYear)) return null;

        const originalSchoolYear = this.getCurrentAttendance().schoolYear;
        const originalLessonTopic = this.getCurrentAttendance().musicLessonTopic;

        try {
            this.getCurrentAttendance().schoolYear = schoolYear;

            const schoolYearConditionsWithCountVariant1 =
                this.getSchoolYearConditionsWithCountMatchRange(
                    HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_1
                );
            let errorMessageVariant1: string = null;
            for (const schoolYearCondition of schoolYearConditionsWithCountVariant1)
                if (isSchoolYearConditionExceedingMax(schoolYearCondition)) {
                    errorMessageVariant1 = `Für die Jahrgänge '${schoolYearRangeToString(
                        schoolYearCondition.schoolYearRange
                    )}' sind im ausgewählten Fach bereits die maximale Anzahl an UBs geplant (${
                        schoolYearCondition.maxAttendances
                    }x).`;
                    break;
                }
            logTrace(
                "current school year counts variant1",
                schoolYearConditionsWithCountVariant1.map(
                    (c) =>
                        `${schoolYearRangeToString(c.schoolYearRange)}; count: ${
                            c.attendanceCount
                        } - min: ${c.minAttendances} - max: ${c.maxAttendances}`
                )
            );

            // case: variant1 invalid, try variant2
            if (errorMessageVariant1 !== null) {
                const schoolYearConditionsWithCountVariant2 =
                    this.getSchoolYearConditionsWithCountMatchRange(
                        HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_2
                    );
                let errorMessageVariant2: string = null;
                for (const schoolYearCondition of schoolYearConditionsWithCountVariant2)
                    if (isSchoolYearConditionExceedingMax(schoolYearCondition)) {
                        errorMessageVariant2 = `Für die Jahrgänge '${schoolYearRangeToString(
                            schoolYearCondition.schoolYearRange
                        )}' sind im ausgewählten Fach bereits die maximale Anzahl an UBs geplant (${
                            schoolYearCondition.maxAttendances
                        }x).`;
                        break;
                    }
                logTrace(
                    "current school year counts variant2",
                    schoolYearConditionsWithCountVariant2.map(
                        (c) =>
                            `${schoolYearRangeToString(c.schoolYearRange)}; count: ${
                                c.attendanceCount
                            } - min: ${c.minAttendances} - max: ${c.maxAttendances}`
                    )
                );

                // case: both variants invalid
                if (errorMessageVariant2 !== null)
                    return this.concatErrorMessages(errorMessageVariant1, errorMessageVariant2);
            }

            // unset topic possibly set from music lesson
            this.getCurrentAttendance().musicLessonTopic = null;

            // validate default stuff like gubs etc.
            return super.validateContextConditions([], schoolYear);
        } finally {
            this.getCurrentAttendance().musicLessonTopic = originalLessonTopic;
            this.getCurrentAttendance().schoolYear = originalSchoolYear;
        }
    }

    /**
     * @param message1
     * @param message2
     * @returns both error messages concatenated with line breaks and prepended with "Variant n" label
     */
    private concatErrorMessages(message1: string, message2: string): string | null {
        if (isStringFalsy(message1) && isStringFalsy(message2)) return null;

        if (!isStringFalsy(message1)) {
            if (!isStringFalsy(message2))
                return `Variante1:\n${message1}\n\nVariante2:\n${message2}`;

            return message1;
        } else return message2;
    }
}

import { getExamiantRoleByExaminantRoleKey, getExaminantRoleKeysToValidate } from "@/abstract/Examinant";
import { getSchoolSubjectBySchoolSubjectKey } from "@/abstract/SchoolSubject";
import B from "@/components/helpers/B";
import Br from "@/components/helpers/Br";
import HelperText from "@/components/helpers/HelperText";
import { getGubSubjectSchoolYearConditionsBySubject, getTotalRequiredGubs } from "@/utils/attendanceValidationConstants";
import { logTrace } from "@/utils/logUtils";
import { cloneObj } from "@/utils/utils";
import { Fragment, ReactNode } from "react";
import { AbstractAttendanceInputValidator } from "../abstract/AbstractAttendanceInputValidator";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { destructSchoolYearConditions, isSchoolYearConditionExceedingMax, SchoolYearCondition } from "../abstract/SchoolYearCondition";
import { SchoolYearConditionOptions } from "../abstract/SchoolYearConditionOptions";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";
import { AttendanceInputValidatorBuilder } from "./AttendanceInputValidatorBuilder";

/**
 * @since 0.1.0
 */
export class ExaminantValidator extends AbstractAttendanceInputValidator<ExaminantEntity[]> {
    private schoolYearValidator: AbstractSchoolYearValidator;

    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        super(currentAttendanceEntity, savedAttendanceEntities);
        this.schoolYearValidator = AttendanceInputValidatorBuilder.builder(currentAttendanceEntity, savedAttendanceEntities)
            .inputType("schoolYear")
            .build() as AbstractSchoolYearValidator;
    }

    /**
     * @returns a 2d array with single element arrays, each of them a selectable examinant
     */
    public getValidValues(): ExaminantEntity[][] {
        return (
            getExaminantRoleKeysToValidate()
                // only validate unchecked examinants
                .filter((examinantRoleKey) => !this.attendanceService.hasExaminant(this.getCurrentAttendance(), examinantRoleKey))
                .map((examinantRoleKey) => [new ExaminantEntity(examinantRoleKey)])
                // pseudo-check each unchecked examinant and validate list
                .filter((examinantEntity) => this.validate([...(this.getCurrentAttendance().examinants ?? []), examinantEntity[0]]) === null)
        );
    }

    public getInvalidValues(): Map<ExaminantEntity[], string> {
        return new Map(
            getExaminantRoleKeysToValidate()
                // only validate unchecked examinants
                .filter((examinantRoleKey) => !this.attendanceService.hasExaminant(this.getCurrentAttendance(), examinantRoleKey))
                .map((examinantRoleKey) => {
                    const examinantEntity = new ExaminantEntity(examinantRoleKey);
                    // pseudo-check each unchecked examinant and validate list
                    const errorMessage = this.validate([...(this.getCurrentAttendance().examinants ?? []), examinantEntity]);

                    return [[examinantEntity], errorMessage] as [ExaminantEntity[], string];
                })
                .filter(([, errorMessage]) => errorMessage !== null)
        );
    }

    public formatValidValues(values?: ExaminantEntity[][]): ReactNode {
        // not implemented
        return "";
    }

    public formatInvalidValues(invalidValues?: Map<ExaminantEntity[], string>): ReactNode {
        if (!invalidValues)
            invalidValues = this.getInvalidValues();

        return Array.from(invalidValues)
                    .map(([invalidExaminants, errorMessage]) => {
                        return invalidExaminants
                            .flat()
                            .map((invalidExaminant, i) => {
                                const invalidExaminantRole = getExamiantRoleByExaminantRoleKey(invalidExaminant.role);
                
                                return (
                                    <Fragment key={i}>
                                        <Br rendered={i >= 1} large={false} />
                
                                        <B>
                                            {invalidExaminantRole}
                                        </B>
                                        <HelperText>{errorMessage}</HelperText>
                                    </Fragment>
                                )

                            })
                    });
    }

    public validateNonContextConditions(constantConditions: any, inputValue: ExaminantEntity[], options?: SchoolYearConditionOptions): string | null {
        // not implemented
        return null;
    }

    public validateContextConditions(constantConditions: any, inputValue: ExaminantEntity[]): string | null {
        const originalExaminants = this.getCurrentAttendance().examinants;
        this.getCurrentAttendance().examinants = inputValue;

        try {
            return this.validateGubs();
        } finally {
            this.getCurrentAttendance().examinants = originalExaminants;
        }
    }

    public validateFuture(inputValue: ExaminantEntity[]): string | null {
        // not implemented
        return null;
    }

    public validate(inputValue: ExaminantEntity[]): string | null {
        if (!this.shouldInputBeValidated(inputValue)) return null;

        const roles = inputValue.map((examinantEntity) => examinantEntity.role);
        logTrace("validate examinant non context", roles);

        let errorMessage = null;

        if ((errorMessage = this.validateNonContextConditions([], inputValue)) !== null) return errorMessage;

        if ((errorMessage = this.validateContextConditions([], inputValue)) !== null) return errorMessage;

        if ((errorMessage = this.validateFuture(inputValue)) !== null) return errorMessage;

        const originalExaminants = cloneObj(this.getCurrentAttendance().examinants);
        try {
            this.getCurrentAttendance().examinants = inputValue;

            if (this.getCurrentAttendance().schoolSubject === "music") {
                // topic will validate school year as well
                const lessonTopicValidator = AttendanceInputValidatorBuilder.builder(this.getCurrentAttendance(), this.getSavedAttendances())
                    .inputType("musicLessonTopic")
                    .build();
                if ((errorMessage = lessonTopicValidator.validate(this.getCurrentAttendance().musicLessonTopic)) !== null) return errorMessage;
            } else {
                const schoolYearValidator = AttendanceInputValidatorBuilder.builder(this.getCurrentAttendance(), this.getSavedAttendances())
                    .inputType("schoolYear")
                    .build();
                if ((errorMessage = schoolYearValidator.validate(this.getCurrentAttendance().schoolYear)) !== null) return errorMessage;
            }

            logTrace("validate examinant, topic valid", roles);

            const dateValidator = AttendanceInputValidatorBuilder.builder(this.getCurrentAttendance(), this.getSavedAttendances())
                .inputType("date")
                .build();
            if ((errorMessage = dateValidator.validate(this.getCurrentAttendance().date)) !== null) return errorMessage;

            logTrace("validate examinant, date valid", roles);
        } finally {
            this.getCurrentAttendance().examinants = originalExaminants;
        }

        return errorMessage;
    }

    /**
     * Validate the gub conditions taking saved attendances into account.
     *
     * Dont validate if `currentAttendance` is not a gub.
     *
     * Does not validate the future as it should always be possible to make a saved attendance a gub.
     *
     * @returns `null` if `schoolYear` is valid or falsy, an error message if invalid
     * @see isGub()
     */
    public validateGubs(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        let errorMessage: string | null = null;
        if ((errorMessage = this.validateGubTotal()) !== null) return errorMessage;

        if ((errorMessage = this.validateGubSubjectSchoolYearConditions()) !== null) return errorMessage;

        return errorMessage;
    }

    /**
     * @returns `null` if current examinant selection is valid or not a gub, an error message if invalid
     * @see {@link getTotalRequiredGubs()}
     */
    private validateGubTotal(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        try {
            const totalNumRequiredGubs = getTotalRequiredGubs();
            let gubCount = 0;
            this.getSavedAttendancesWithoutCurrent().forEach((savedAttendance) => {
                if (this.attendanceService.isGub(savedAttendance)) gubCount++;

                if (gubCount === totalNumRequiredGubs)
                    throw new Error(`Du has bereits all GUBs geplant (${totalNumRequiredGubs}x). Entferne mindestens einen GUB relevanten Prüfer.`);
            });
        } catch (e) {
            return e.message;
        }

        return null;
    }

    /**
     * @returns `null` if current examinant selection is valid or not a gub, an error message if invalid
     * @see {@link getGubSubjectSchoolYearConditionsBySubject()}
     */
    private validateGubSubjectSchoolYearConditions(): null | string {
        // case: not a gub, cannot be invalid
        if (!this.attendanceService.isGub(this.getCurrentAttendance())) return null;

        try {
            // validate gub subject conditions
            const gubSubjectConditionsWithCount = destructSchoolYearConditions(
                this.schoolYearValidator.getSchoolYearConditionsWithCount(
                    getGubSubjectSchoolYearConditionsBySubject(this.getCurrentAttendance().schoolSubject),
                    (savedAttendance: AttendanceEntity, schoolYearCondition: SchoolYearCondition) => {
                        const isGub = this.attendanceService.isGub(savedAttendance);
                        // NOTE: assume that subject conditions apply to any schoolyear. Dont remove this should this condition change. Remember that current schoolyear may be falsy
                        // const isSchoolYearWithinRange = isWithinSchoolYearRange(savedAttendance.schoolYear, schoolYearCondition.schoolYearRange);
                        const isSameSubject = savedAttendance.schoolSubject === this.getCurrentAttendance().schoolSubject;

                        return isGub && isSameSubject;
                    },
                    {
                        includeCurrentAttendanceEntity: true,
                        dontFilterBySchoolSubjectToValidateFor: true,
                        allowInvalidSchoolYear: true,
                    }
                )
            );

            for (const gubCondition of gubSubjectConditionsWithCount)
                if (isSchoolYearConditionExceedingMax(gubCondition))
                    throw new Error(
                        `Du hast bereits alle GUBs für das Fach '${getSchoolSubjectBySchoolSubjectKey(this.getCurrentAttendance().schoolSubject)}' (${
                            gubCondition.maxAttendances
                        }x) geplant. Entferne mindestens einen GUB relevanten Prüfer oder wähle ein anderes Fach aus.`
                    );
        } catch (e) {
            return e.message;
        }

        return null;
    }

    public shouldInputBeValidated(inputValue: ExaminantEntity[]): boolean {
        return !!inputValue && !!inputValue.length;
    }
}

import {getExaminantRoleKeysToValidate} from "@/abstract/Examinant";
import {logDebug, logTrace} from "@/utils/logUtils";
import {cloneObj} from "@/utils/utils";
import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {AbstractAttendanceInputValidator} from "../abstract/AbstractAttendanceInputValidator";
import {AttendanceEntity, ExaminantEntity} from "../DbSchema";
import {AttendanceInputValidatorBuilder} from "./AttendanceInputValidatorBuilder";
import { SchoolYearConditionOptions } from "../abstract/SchoolYearConditionOptions";

/**
 * @since 0.1.0
 */
export class ExamianntValidator extends AbstractAttendanceInputValidator<ExaminantEntity[]> {
    /**
     * @returns a 2d array with single element arrays, each of them a selectable examinant
     */
    public getValidValues(): ValueOf<AttendanceEntity>[] {
        return (
            getExaminantRoleKeysToValidate()
                // only validate unchecked examinants
                .filter((examinantRoleKey) => !this.attendanceService.hasExaminant(this.getCurrentAttendance(), examinantRoleKey))
                .map((examinantRoleKey) => [new ExaminantEntity(examinantRoleKey)])
                // pseudo-check each unchecked examinant and validate list
                .filter((examinantEntity) => this.validate([...(this.getCurrentAttendance().examinants ?? []), examinantEntity[0]]) === null)
        );
    }

    public getInvalidValues(): ValueOf<AttendanceEntity>[] {
        // not implemented
        return [];
    }

    public validateNonContextConditions(constantConditions: any, inputValue: ExaminantEntity[], options?: SchoolYearConditionOptions): string | null {
        // not implemented
        return null;
    }

    public validateContextConditions(constantConditions: any, inputValue: ExaminantEntity[]): string | null {
        // not implemented
        return null;
    }

    public validateFuture(inputValue: ExaminantEntity[]): string | null {
        // not implemented
        return null;
    }

    public validate(inputValue: ExaminantEntity[]): string | null {
        if (!this.shouldInputBeValidated(inputValue)) return null;

        const roles = inputValue.map((examinantEntity) => examinantEntity.role);
        logTrace("validate non context", roles);

        let errorMessage = null;

        if ((errorMessage = this.validateNonContextConditions([], inputValue)) !== null) return errorMessage;

        if ((errorMessage = this.validateContextConditions([], inputValue)) !== null) return errorMessage;

        if ((errorMessage = this.validateFuture(inputValue)) !== null) return errorMessage;

        const originalExaminants = cloneObj(this.getCurrentAttendance().examinants);
        try {
            this.getCurrentAttendance().examinants = inputValue;

            const lessonTopicValidator = AttendanceInputValidatorBuilder.builder(this.getCurrentAttendance(), this.getSavedAttendances())
                .inputType("musicLessonTopic")
                .build();
            if ((errorMessage = lessonTopicValidator.validate(this.getCurrentAttendance().musicLessonTopic)) !== null) return errorMessage;

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

    public shouldInputBeValidated(inputValue: ExaminantEntity[]): boolean {
        return !!inputValue && !!inputValue.length;
    }
}

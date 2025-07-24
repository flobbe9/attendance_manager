import {ExaminantRole_Key, getExamiantRoleByExaminantRoleKey} from "@/abstract/Examinant";
import {logTrace} from "@/utils/logUtils";
import {formatDateGermanNoTime} from "@/utils/projectUtils";
import {dateEquals} from "@/utils/utils";
import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {AbstractAttendanceInputValidator} from "../abstract/AbstractAttendanceInputValidator";
import {AttendanceEntity} from "../entities/AttendanceEntity";
import { SchoolYearConditionOptions } from "../abstract/SchoolYearConditionOptions";

export class DateValidator extends AbstractAttendanceInputValidator<Date> {
    public getValidValues(): ValueOf<AttendanceEntity>[] {
        // not implemented, use getInvalidValues() instead
        return [];
    }

    /**
     * @returns list of invalid dates that should not be selectable
     */
    public getInvalidValues(): ValueOf<AttendanceEntity>[] {
        const invalidValues = new Set<Date>();

        // find all dates where the a current examinant is already planned
        if (this.getCurrentAttendance().examinants) {
            const savedAttendances = this.getSavedAttendancesWithoutCurrent();

            this.getCurrentAttendance().examinants.forEach((examinantEntity) => {
                this.attendanceService
                    .findAllByExaminant(savedAttendances, examinantEntity.role)
                    .forEach((savedAttendance) => {
                        if (savedAttendance.date) invalidValues.add(savedAttendance.date);
                    });
            });
        }

        return [...invalidValues];
    }

    public validateNonContextConditions(constantConditions: any, inputValue: Date, options?: SchoolYearConditionOptions): string | null {
        // not implemented, nothing to validate
        return null;
    }

    /**
     * Validate examinants.
     *
     * @param constantConditions
     * @param inputValue
     * @returns
     */
    public validateContextConditions(constantConditions: any, inputValue: Date): string | null {
        if (!this.shouldInputBeValidated(inputValue)) return null;

        const selectedDate = inputValue;
        const examinantsPresentOnSelectedDate = new Set<ExaminantRole_Key>(
            this.getSavedAttendancesWithoutCurrent()
                .filter((savedAttendance) => dateEquals(selectedDate, savedAttendance.date))
                .map((savedAttendance) => savedAttendance.examinants)
                .flat()
                .map((examinantEntity) => examinantEntity.role)
        );

        try {
            for (const examinantEntity of this.getCurrentAttendance().examinants)
                if (examinantsPresentOnSelectedDate.has(examinantEntity.role))
                    throw new Error(
                        `Ein Prüfer mit der Rolle '${getExamiantRoleByExaminantRoleKey(
                            examinantEntity.role
                        )}' ist am ${formatDateGermanNoTime(
                            selectedDate
                        )} bereits bei einem anderen UB anwesend. Entferne den Prüfer oder wähle ein anderes Datum aus.`
                    );
        } catch (e) {
            return e.message;
        }

        return null;
    }

    public validateFuture(inputValue: Date): string | null {
        // not implemented, nothing to validate
        return null;
    }

    public validate(inputValue: Date): string | null {
        if (!this.shouldInputBeValidated(inputValue)) return null;

        let errorMessage: string = null;

        logTrace("validate date", formatDateGermanNoTime(inputValue));
        if ((errorMessage = this.validateNonContextConditions([], inputValue)) !== null)
            return errorMessage;
        logTrace("date - non context valid");

        if ((errorMessage = this.validateContextConditions([], inputValue)) !== null)
            return errorMessage;
        logTrace("date - context valid");

        if ((errorMessage = this.validateFuture(inputValue)) !== null) return errorMessage;
        logTrace("date - future valid");
        logTrace();

        return errorMessage;
    }

    public shouldInputBeValidated(inputValue: Date): boolean {
        return !!inputValue && !!this.getCurrentAttendance().examinants?.length;
    }
}

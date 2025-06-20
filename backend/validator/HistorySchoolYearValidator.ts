import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { SchoolYearCondition } from "../abstract/SchoolYearCondition";
import { AttendanceEntity } from "../DbSchema";
import { SchoolYear } from "@/abstract/SchoolYear";

/**
 * @since latest
 */
export class HistorySchoolYearValidator extends AbstractSchoolYearValidator {

    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        super(currentAttendanceEntity, savedAttendanceEntities, "history");
    }

    public getValidValues(): ValueOf<AttendanceEntity>[] {
        return [];
    }

    protected getCurrentlyUnsatisfiedSchoolYearConditions(allConstantSchoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {
        return [];
    }

    public validateFuture(inputValue: SchoolYear): string | null {
        return null;
    }

    public validate(inputValue: SchoolYear): string | null {
        return null;
    }
}

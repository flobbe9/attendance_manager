import {SchoolYearCondition} from "@/backend/abstract/SchoolYearCondition";
/**
 * Options to pass to getter methods that retrieve school year conditions.
 *
 * @since 0.1.0
 * @see SchoolYearCondition
 */
export interface SchoolYearConditionOptions {
    /** Whether to include current (`true`), remove it if saved (`false`) or just return unmodified `savedAttendances` (`null`). Default may vary */
    includeCurrentAttendanceEntity: boolean | null;
    /** Whether to include attendance entities with any subject. Does not regard the examinant role. Default is `false` */
    dontFilterBySchoolSubjectToValidateFor?: boolean;
}

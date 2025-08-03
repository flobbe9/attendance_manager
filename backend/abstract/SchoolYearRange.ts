import {SchoolYear} from "@/abstract/SchoolYear";
import {defaultEquals, parseNumOrReturnNull, parseNumOrThrow} from "@/utils/projectUtils";
import {assertFalsyAndThrow, cloneObj, isNumberFalsy} from "@/utils/utils";
import { SchoolYearCondition } from "./SchoolYearCondition";

/**
 * @since 0.1.0
 */
export interface SchoolYearRange {
    min: SchoolYear;
    max: SchoolYear;
}

export function schoolYearRangeToString(schoolYearRange: SchoolYearRange): string {
    return schoolYearRange ? `${schoolYearRange.min} - ${schoolYearRange.max}` : "";
}

/**
 * @param schoolYear to check
 * @param schoolYearRange
 * @param includeEdges if `true` then range min and max will be considered "withing" range. Default is `true`
 */
export function isWithinSchoolYearRange(schoolYear: SchoolYear, schoolYearRange: SchoolYearRange, includeEdges = true): boolean {
    assertFalsyAndThrow(schoolYear, schoolYearRange);

    // case: is edge
    if (schoolYear === schoolYearRange.min || schoolYear === schoolYearRange.max) return includeEdges;

    const schoolYearNum = parseNumOrThrow(schoolYear);
    const schoolYearRangeMinNum = parseNumOrReturnNull(schoolYearRange.min) ?? -Infinity;
    const schoolYearRangeMaxNum = parseNumOrReturnNull(schoolYearRange.max) ?? Infinity;

    return schoolYearNum < schoolYearRangeMaxNum && schoolYearNum > schoolYearRangeMinNum;
}

/**
 * @param schoolYearRange1
 * @param schoolYearRange2
 * @param includeEdges if `true`, `min === max` will be considered an overlap. Default is `true`
 * @returns `true` if at least one end of range 1 / 2 lies within the other range
 */
export function isSchoolYearRangeOverlap(schoolYearRange1: SchoolYearRange, schoolYearRange2: SchoolYearRange, includeEdges = true): boolean {
    assertFalsyAndThrow(schoolYearRange1, schoolYearRange2);

    // case: one range has no start and end, overlap must be true
    if ((!schoolYearRange1.min && !schoolYearRange1.max) || (!schoolYearRange2.min && !schoolYearRange2.max)) return true;

    const range1OverlapsRange2 =
        isWithinSchoolYearRange(schoolYearRange1.min, schoolYearRange2, includeEdges) ||
        isWithinSchoolYearRange(schoolYearRange1.max, schoolYearRange2, includeEdges);
    const range2OverlapsRange1 =
        isWithinSchoolYearRange(schoolYearRange2.min, schoolYearRange1, includeEdges) ||
        isWithinSchoolYearRange(schoolYearRange2.max, schoolYearRange1, includeEdges);

    return range2OverlapsRange1 || range1OverlapsRange2;
}

/**
 * Dont consider distinct falsy values.
 *
 * @param schoolYearRange1
 * @param schoolYearRange2
 * @returns `true` if all fields "defaultEqual" or params are both falsy
 */
export function equalsSchoolYearRange(schoolYearRange1: SchoolYearRange, schoolYearRange2: SchoolYearRange): boolean {
    if (!schoolYearRange1 || !schoolYearRange2) return defaultEquals(schoolYearRange1, schoolYearRange2);

    return defaultEquals(schoolYearRange1.min, schoolYearRange2.min) && defaultEquals(schoolYearRange1.max, schoolYearRange2.max);
}

/**
 * @param schoolYearRange to get size for
 * @returns the differential of `schoolYearRange.max - schoolYearRange.min`.
 * `MAX_SAFE_INTEGER` if max is falsy, `MIN_SAFE_INTEGER` if min is falsy, `NaN` if both are falsy
 */
export function getSchoolYearRangeSize(schoolYearRange: SchoolYearRange): number {
    assertFalsyAndThrow(schoolYearRange);

    const {min, max} = schoolYearRange;

    const minNumber = parseNumOrReturnNull(min);
    const maxNumber = parseNumOrReturnNull(max);

    if (minNumber === null && maxNumber === null) return NaN;

    if (minNumber === null) return Number.MIN_SAFE_INTEGER;

    if (maxNumber === null) return Number.MAX_SAFE_INTEGER;

    return maxNumber - minNumber;
}

/**
 * Consider an invalid range (falsy min and falsy max) as higher value as any other valid range.
 *
 * @param schoolYearRange1
 * @param schoolYearRange2
 * @returns
 */
export function compareSchoolYearRangeSizes(schoolYearRange1: SchoolYearRange, schoolYearRange2: SchoolYearRange): number {
    const range1Size = getSchoolYearRangeSize(schoolYearRange1);
    const range2Size = getSchoolYearRangeSize(schoolYearRange2);

    // case: no range at all, put these last
    if (isNaN(range1Size)) {
        if (isNaN(range2Size)) return 0;

        return 1;
    }

    if (isNaN(range2Size)) return -1;

    return range1Size - range2Size;
}

/**
 * Consider an invalid attendanceCount 0.
 *
 * @param schoolYearCondition1
 * @param schoolYearCondition2
 * @returns
 */
export function compareSchoolConditionByAttendanceCount(schoolYearCondition1: SchoolYearCondition, schoolYearCondition2: SchoolYearCondition): number {
    assertFalsyAndThrow(schoolYearCondition1, schoolYearCondition2);

    if (isNumberFalsy(schoolYearCondition1.attendanceCount)) 
        schoolYearCondition1.attendanceCount = 0;

    if (isNumberFalsy(schoolYearCondition2.attendanceCount)) 
        schoolYearCondition2.attendanceCount = 0;

    return schoolYearCondition1.attendanceCount - schoolYearCondition2.attendanceCount;
}

import { SchoolYear } from "@/abstract/SchoolYear";
import { defaultEquals, parseNumOrReturnNull, parseNumOrThrow } from "@/utils/projectUtils";
import { assertFalsyAndThrow } from "@/utils/utils";


/**
 * @since latest
 */
export interface SchoolYearRange {
    min: SchoolYear
    max: SchoolYear
}


/**
 * @param schoolYear to check
 * @param schoolYearRange 
 * @param includeEdges if `true` then range min and max will be considered "withing" range. Default is `true`
 */
export function isWithinSchoolYearRange(schoolYear: SchoolYear, schoolYearRange: SchoolYearRange, includeEdges = true): boolean {

    assertFalsyAndThrow(schoolYear, schoolYearRange);

    // case: is edge
    if (schoolYear === schoolYearRange.min || schoolYear === schoolYearRange.max)
        return includeEdges;

    const schoolYearNum = parseNumOrThrow(schoolYear);
    const schoolYearRangeMinNum = parseNumOrReturnNull(schoolYearRange.min) ?? -Infinity;
    const schoolYearRangeMaxNum = parseNumOrReturnNull(schoolYearRange.max) ?? Infinity;

    return schoolYearNum < schoolYearRangeMaxNum && schoolYearNum > schoolYearRangeMinNum;
}


/**
 * Dont consider distinct falsy values.
 * 
 * @param schoolYearRange1 
 * @param schoolYearRange2 
 * @returns `true` if all fields "defaultEqual" or params are both falsy
 */
export function equalsSchoolYearRange(schoolYearRange1: SchoolYearRange, schoolYearRange2: SchoolYearRange): boolean {

    if (!schoolYearRange1 || !schoolYearRange2)
        return defaultEquals(schoolYearRange1, schoolYearRange2);

    return defaultEquals(schoolYearRange1.min, schoolYearRange2.min) &&
        defaultEquals(schoolYearRange1.max, schoolYearRange2.max);
}
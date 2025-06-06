import { MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { equalsSchoolYearRange, isWithinSchoolYearRange, SchoolYearRange } from "./SchoolYearRange";
import { SchoolSubject } from "@/abstract/SchoolSubject";
import { SchoolYear } from "@/abstract/SchoolYear";
import { assertFalsyAndThrow } from "@/utils/utils";
import { defaultEquals } from "@/utils/projectUtils";


/**
 * @since latest
 */
export interface SchoolYearCondition {
    
    /** Min num attendances required with this `schoolYearRange` or `topic` */
    minAttendances: number;
    /** Min num attendances allowed with this `schoolYearRange` or `topic` */
    maxAttendances: number | null;
    schoolYearRange: SchoolYearRange;
    /** Only relevant for subject `music` */
    topic?: MusicLessonTopic_Key,
}


/**
 * @param schoolYear by which to search
 * @param schoolYearConditions to look through
 * @param includeEdges see {@link isWithinSchoolYearRange}
 * @returns array of `[schoolYearConditions, schoolYearConditionIndex]` sothat `schoolYear` is within range of `condition.schoolYearRange`. Empty array if no match
 */
export function findSchoolYearConditionsBySchoolYearRange(schoolYear: SchoolYear, schoolYearConditions: SchoolYearCondition[], includeEdges = true): [SchoolYearCondition, number][] {

    assertFalsyAndThrow(schoolYear, schoolYearConditions);

    const schoolYearConditionsAndIndices: [SchoolYearCondition, number][] = (schoolYearConditions
        .map((schoolYearCondition, i) => 
            [schoolYearCondition, i]) as [SchoolYearCondition, number][])
        .filter(([schoolYearCondition, ]) => 
            isWithinSchoolYearRange(schoolYear, schoolYearCondition.schoolYearRange, includeEdges))

    return schoolYearConditionsAndIndices;
}


/**
 * Dont consider distinct falsy values.
 * 
 * @param schoolYearCondition1 
 * @param schoolYearCondition2 
 * @returns `true` if all fields "defaultEqual" or params are both falsy
 */
export function equalsSchoolYearCondition(schoolYearCondition1: SchoolYearCondition, schoolYearCondition2: SchoolYearCondition): boolean {

    if (!schoolYearCondition1 || !schoolYearCondition2)
        return defaultEquals(schoolYearCondition1, schoolYearCondition2);

    return defaultEquals(schoolYearCondition1.minAttendances, schoolYearCondition2.minAttendances) &&
        defaultEquals(schoolYearCondition1.maxAttendances, schoolYearCondition2.maxAttendances) &&
        defaultEquals(schoolYearCondition1.topic, schoolYearCondition2.topic) &&
        equalsSchoolYearRange(schoolYearCondition1.schoolYearRange, schoolYearCondition2.schoolYearRange);
}


/**
 * @param schoolYearConditions1 
 * @param schoolYearConditions2 
 * @returns `true` if elements with the same index are equal. Will not consider distinct falsy types for params
 * @see {@link equalsSchoolYearCondition}
 */
export function equalsSchoolYearConditions(schoolYearConditions1: SchoolYearCondition[], schoolYearConditions2: SchoolYearCondition[]): boolean {

    if (!schoolYearConditions1 || !schoolYearConditions2)
        return defaultEquals(schoolYearConditions1, schoolYearConditions2);

    if (schoolYearConditions1.length !== schoolYearConditions2.length)
        return false;

    return !schoolYearConditions1
        .find((schoolYearCondition1, i) => 
            !equalsSchoolYearCondition(schoolYearCondition1, schoolYearConditions2[i]));
}
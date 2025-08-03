import {ExaminantRole_Key} from "@/abstract/Examinant";
import {MusicLessonTopic_Key} from "@/abstract/MusicLessonTopic";
import {SchoolYear} from "@/abstract/SchoolYear";
import {defaultEquals, defaultEqualsFalsy} from "@/utils/projectUtils";
import {assertFalsyAndThrow, cloneObj, isNumberFalsy} from "@/utils/utils";
import {
    compareSchoolConditionByAttendanceCount,
    compareSchoolYearRangeSizes,
    equalsSchoolYearRange,
    getSchoolYearRangeSize,
    isWithinSchoolYearRange,
    SchoolYearRange,
} from "./SchoolYearRange";

/**
 * @since 0.1.0
 */
export interface SchoolYearCondition {
    /** Min num attendances required with this `schoolYearRange` or `topic` */
    minAttendances: number;
    /** Min num attendances allowed with this `schoolYearRange` or `topic` */
    maxAttendances: number | null;
    schoolYearRange: SchoolYearRange;
    /** Only relevant for subject `music` */
    lessonTopic?: MusicLessonTopic_Key;
    examinantRole?: ExaminantRole_Key;
    /** The number of saved attendances that match this condition. This count can be used during validation e.g. */
    attendanceCount?: number;
}

/**
 * @param schoolYear by which to search
 * @param schoolYearConditions to look through
 * @param includeEdges see {@link isWithinSchoolYearRange}
 * @returns array of `[schoolYearConditions, schoolYearConditionIndex]` sothat `schoolYear` is within range of `condition.schoolYearRange`. Empty array if no match or `schoolYear` is falsy
 */
export function findSchoolYearConditionsBySchoolYearRange(
    schoolYear: SchoolYear,
    schoolYearConditions: SchoolYearCondition[],
    includeEdges = true
): [SchoolYearCondition, number][] {
    assertFalsyAndThrow(schoolYearConditions);

    if (!schoolYear) return [];

    const schoolYearConditionsAndIndices: [SchoolYearCondition, number][] = (
        schoolYearConditions.map((schoolYearCondition, i) => [schoolYearCondition, i]) as [SchoolYearCondition, number][]
    ).filter(([schoolYearCondition]) => isWithinSchoolYearRange(schoolYear, schoolYearCondition.schoolYearRange, includeEdges));

    return schoolYearConditionsAndIndices;
}

/**
 * @param lessonTopic by which to search. If falsy, use {@link defaultEqualsFalsy()} as comparetor
 * @param schoolYearConditions to look through
 * @returns array of `[schoolYearConditions, schoolYearConditionIndex]` sothat `schoolYear` is within range of `condition.schoolYearRange`. Empty array if no match
 */
export function findSchoolYearConditionsByLessonTopic(
    lessonTopic: MusicLessonTopic_Key,
    schoolYearConditions: SchoolYearCondition[]
): [SchoolYearCondition, number][] {
    assertFalsyAndThrow(schoolYearConditions);

    const schoolYearConditionsAndIndices: [SchoolYearCondition, number][] = (
        schoolYearConditions.map((schoolYearCondition, i) => [schoolYearCondition, i]) as [SchoolYearCondition, number][]
    ).filter(
        ([schoolYearCondition]) => defaultEqualsFalsy(lessonTopic, schoolYearCondition.lessonTopic) || lessonTopic === schoolYearCondition.lessonTopic
    );

    return schoolYearConditionsAndIndices;
}

/**
 * @param schoolYearConditions to sort
 * @returns modified `schoolYearConditions` sorted by range size in ascending order
 * @throws if falsy param
 * @see {@link getSchoolYearRangeSize}
 * @see {@link compareSchoolYearRangeSizes}
 */
export function sortSchoolYearConditionsByRangeSize(schoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {
    assertFalsyAndThrow(schoolYearConditions);

    return schoolYearConditions.sort((condition1, condition2) => compareSchoolYearRangeSizes(condition1.schoolYearRange, condition2.schoolYearRange));
}

/**
 * @param schoolYearConditions
 * @returns modified `schoolYearConditions` sorted by `attendanceCount` asc
 */
export function sortSchoolYearConditionsByAttendanceCount(schoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {
    assertFalsyAndThrow(schoolYearConditions);

    return schoolYearConditions.sort((c1, c2) => compareSchoolConditionByAttendanceCount(c1, c2));
}

/**
 * Dont consider distinct falsy values.
 *
 * @param schoolYearCondition1
 * @param schoolYearCondition2
 * @returns `true` if all fields "defaultEqual" or params are both falsy
 */
export function equalsSchoolYearCondition(schoolYearCondition1: SchoolYearCondition, schoolYearCondition2: SchoolYearCondition): boolean {
    const equalsFalsy = defaultEqualsFalsy(schoolYearCondition1, schoolYearCondition2);
    if (equalsFalsy !== null) return equalsFalsy;

    return (
        defaultEquals(schoolYearCondition1.minAttendances, schoolYearCondition2.minAttendances) &&
        defaultEquals(schoolYearCondition1.maxAttendances, schoolYearCondition2.maxAttendances) &&
        defaultEquals(schoolYearCondition1.lessonTopic, schoolYearCondition2.lessonTopic) &&
        defaultEquals(schoolYearCondition1.attendanceCount, schoolYearCondition2.attendanceCount) &&
        equalsSchoolYearRange(schoolYearCondition1.schoolYearRange, schoolYearCondition2.schoolYearRange)
    );
}

/**
 * @param schoolYearConditions1
 * @param schoolYearConditions2
 * @returns `true` if elements with the same index are equal. Will not consider distinct falsy types for params
 * @see {@link equalsSchoolYearCondition}
 */
export function equalsSchoolYearConditions(schoolYearConditions1: SchoolYearCondition[], schoolYearConditions2: SchoolYearCondition[]): boolean {
    const equalsFalsy = defaultEqualsFalsy(schoolYearConditions1, schoolYearConditions2);
    if (equalsFalsy !== null) return equalsFalsy;

    if (schoolYearConditions1.length !== schoolYearConditions2.length) return false;

    return !schoolYearConditions1.find((schoolYearCondition1, i) => !equalsSchoolYearCondition(schoolYearCondition1, schoolYearConditions2[i]));
}

/**
 * Pushes a condition for every `minAttendances`. E.g. Will convert a condition with `minAttendances === 3` into 3 equal conditions,
 * each with `minAttendances === 1`.
 *
 * @param schoolYearConditions to destruct (wont be modified)
 * @returns list of schoolyear conditions, each with `minAttendances === 1`
 */
export function destructSchoolYearConditions(schoolYearConditions: SchoolYearCondition[]): SchoolYearCondition[] {
    assertFalsyAndThrow(schoolYearConditions);

    const clonedSchoolYearConditions = cloneObj(schoolYearConditions);
    const destructedSchoolYearConditions: SchoolYearCondition[] = [];

    clonedSchoolYearConditions.forEach((schoolYearCondition) => {
        // case: no required amount, nothing to destruct
        if (isNumberFalsy(schoolYearCondition.minAttendances)) {
            destructedSchoolYearConditions.push(schoolYearCondition);
            return;
        }

        for (let i = 0; i < schoolYearCondition.minAttendances; i++) {
            // set minAttendances to 1
            const destructedSchoolYearCondition = cloneObj(schoolYearCondition);
            destructedSchoolYearCondition.minAttendances = 1;

            destructedSchoolYearConditions.push(destructedSchoolYearCondition);
        }
    });

    return destructedSchoolYearConditions;
}

/**
 * @param schoolYearCondition to check
 * @returns `true` if this condition's `attendanceCount` is higher (not equal) than it's max attendance value
 */
export function isSchoolYearConditionExceedingMax(schoolYearCondition: SchoolYearCondition): boolean {
    return (
        !isNumberFalsy(schoolYearCondition.attendanceCount) &&
        !isNumberFalsy(schoolYearCondition.maxAttendances) &&
        schoolYearCondition.attendanceCount > schoolYearCondition.maxAttendances
    );
}

/**
 * @param schoolYearCondition to check
 * @returns `true` if this condition's `attendanceCount` is equal it's max attendance value
 */
export function isSchoolYearConditionMaxedOut(schoolYearCondition: SchoolYearCondition): boolean {
    return (
        !isNumberFalsy(schoolYearCondition.attendanceCount) &&
        !isNumberFalsy(schoolYearCondition.maxAttendances) &&
        schoolYearCondition.attendanceCount === schoolYearCondition.maxAttendances
    );
}

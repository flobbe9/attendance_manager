/**
 * Make sure to be consistent with object value indices!
 */

/** Order is hardcoded in ExaminantService.test.js */
export const schoolSubjectKeysObj = {
    history: {
        index: 0,
        validate: true,
    },
    music: {
        index: 1,
        validate: true,
    },
};
export type SchoolSubject_Key = keyof typeof schoolSubjectKeysObj;
export const SCHOOL_SUBJECT_KEYS: SchoolSubject_Key[] = Object.keys(schoolSubjectKeysObj) as SchoolSubject_Key[];

export const schoolSubjectValuesObj = { Geschichte: 0, Musik: 1 };
/**
 *  @since 0.0.1
 */
export type SchoolSubject = keyof typeof schoolSubjectValuesObj;
export const SCHOOL_SUBJECTS: SchoolSubject[] = Object.keys(schoolSubjectValuesObj) as SchoolSubject[];

/**
 * @param schoolSubjectKey 
 * @returns the related `SchoolSubject` or `schoolSubjectKey` itself. `null` if is neither `SchoolSubject` nor `SchoolSubject_Key`
 */
export function getSchoolSubjectBySchoolSubjectKey(schoolSubjectKey: string): SchoolSubject {
    if (isSchoolSubjectKey(schoolSubjectKey))
        return SCHOOL_SUBJECTS[SCHOOL_SUBJECT_KEYS.indexOf(schoolSubjectKey)];

    if (isSchoolSubject(schoolSubjectKey))
        return schoolSubjectKey;

    return null;
}

/**
 * @param schoolSubject
 * @returns the related `SchoolSubject_Key` or `schoolSubject` itself. `null` if is neither `SchoolSubject` nor `SchoolSubject_Key`
 */
export function getSchoolSubjectKeyBySchoolSubject(schoolSubject: string): SchoolSubject_Key {
    if (isSchoolSubject(schoolSubject))
        return SCHOOL_SUBJECT_KEYS[SCHOOL_SUBJECTS.indexOf(schoolSubject)];

    if (isSchoolSubjectKey(schoolSubject))
        return schoolSubject;

    return null;
}

function isSchoolSubject(schoolSubject: string): schoolSubject is SchoolSubject {
    return SCHOOL_SUBJECTS.includes(schoolSubject as SchoolSubject);
}

function isSchoolSubjectKey(schoolSubjectKey: string): schoolSubjectKey is SchoolSubject_Key {
    return SCHOOL_SUBJECT_KEYS.includes(schoolSubjectKey as SchoolSubject_Key);
}
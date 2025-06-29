/**
 * Make sure to be consistent with object value indices! 
 */

/** Order is hardcoded in ExaminantService.test.js */
export const schoolSubjectKeysObj = {"history": 0, "music": 1};
export type SchoolSubject_Key = keyof typeof schoolSubjectKeysObj;
export const SCHOOL_SUBJECT_KEYS: SchoolSubject_Key[] = Object.keys(schoolSubjectKeysObj) as SchoolSubject_Key[]; 

export const schoolSubjectValuesObj = {"Geschichte": 0, "Musik": 1};
/**
 *  @since 0.0.1
 */
export type SchoolSubject = keyof typeof schoolSubjectValuesObj;
export const SCHOOL_SUBJECTS: SchoolSubject[] = Object.keys(schoolSubjectValuesObj) as SchoolSubject[]; 

export function getSchoolSubjectBySchoolSubjectKey(key: SchoolSubject_Key): SchoolSubject {
    return SCHOOL_SUBJECTS[SCHOOL_SUBJECT_KEYS.indexOf(key)];
}

export function getSchoolSubjectKeyBySchoolSubject(schoolSubject: SchoolSubject): SchoolSubject_Key {
    return SCHOOL_SUBJECT_KEYS[SCHOOL_SUBJECTS.indexOf(schoolSubject)];
}
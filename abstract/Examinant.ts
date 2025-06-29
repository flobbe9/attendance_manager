import { SCHOOL_SUBJECTS, SchoolSubject, SchoolSubject_Key, schoolSubjectKeysObj, schoolSubjectValuesObj } from "./SchoolSubject";

/** Order is hardcoded in ExaminantService.test.js */
export const examinantRoleKeysObject = {
    ...schoolSubjectKeysObj,
    "educator": SCHOOL_SUBJECTS.length,
    "headmaster": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type ExaminantRole_Key = keyof typeof examinantRoleKeysObject | SchoolSubject_Key;
export const EXAMINANT_ROLE_KEYS: ExaminantRole_Key[] = Object.keys(examinantRoleKeysObject) as ExaminantRole_Key[]; 


const examinantRoleValuesObj = {
    ...schoolSubjectValuesObj,
    "Pädagoge": SCHOOL_SUBJECTS.length,
    "Schulleitung": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type ExaminantRole = keyof typeof examinantRoleValuesObj | SchoolSubject;
export const EXAMINANT_ROLES: ExaminantRole[] = Object.keys(examinantRoleValuesObj) as ExaminantRole[];

export function getExamiantRoleByExaminantRoleKey(examinantRoleKey: ExaminantRole_Key): ExaminantRole {
    return EXAMINANT_ROLES[EXAMINANT_ROLE_KEYS.indexOf(examinantRoleKey)];
}
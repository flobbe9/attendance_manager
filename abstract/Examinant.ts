import { SCHOOL_SUBJECTS, SchoolSubject_Key } from "./SchoolSubject";


export const examinantRoleKeysObject = {
    "educator": SCHOOL_SUBJECTS.length,
    "headmaster": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type ExaminantRole_Key = keyof typeof examinantRoleKeysObject | SchoolSubject_Key;
export const EXAMINANT_ROLE_KEYS: ExaminantRole_Key[] = Object.keys(examinantRoleKeysObject) as ExaminantRole_Key[]; 


const examinantRoleValuesObj = {
    "Pädagoge": SCHOOL_SUBJECTS.length,
    "Schulleitung": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type ExaminantRole = keyof typeof examinantRoleValuesObj | SchoolSubject_Key;
export const EXAMINANT_ROLES: ExaminantRole[] = Object.keys(examinantRoleValuesObj) as ExaminantRole[]; 
import { AttendanceInputConstantValue } from "@/backend/abstract/AttendanceInputConstantValue";
import { SCHOOL_SUBJECTS, SchoolSubject, SchoolSubject_Key, schoolSubjectKeysObj, schoolSubjectValuesObj } from "./SchoolSubject";

/** Order is hardcoded in ExaminantService.test.js */
export const examinantRoleKeysObject: Record<string, AttendanceInputConstantValue> = {
    ...schoolSubjectKeysObj,
    "educator": {
        index: SCHOOL_SUBJECTS.length,
        validate: true
    },
    "headmaster": {
        index: SCHOOL_SUBJECTS.length + 1,
        validate: false
    }
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

export function getExaminantRoleKeysToValidate(): ExaminantRole_Key[] {
    return Object.entries(examinantRoleKeysObject)
        .filter(([, examinantRoleValue]) => examinantRoleValue.validate)
        .map(([examinantRoleKey, ]) => examinantRoleKey);
}
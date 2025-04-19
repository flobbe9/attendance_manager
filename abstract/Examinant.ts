import { SCHOOL_SUBJECTS, schoolSubjectKeysObj, schoolSubjectValuesObj } from "./SchoolSubject";


const examinantKeysObject = {
    ...schoolSubjectKeysObj,
    "educator": SCHOOL_SUBJECTS.length,
    "headmaster": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type Examinant_Key = keyof typeof examinantKeysObject;
export const EXAMINANT_KEYS: Examinant_Key[] = Object.keys(examinantKeysObject) as Examinant_Key[]; 


const examinantValuesObj = {
    ...schoolSubjectKeysObj,
    "Pädagoge": SCHOOL_SUBJECTS.length,
    "Schulleitung": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type Examinant = keyof typeof examinantValuesObj;
export const EXAMINANTS: Examinant[] = Object.keys(examinantValuesObj) as Examinant[]; 
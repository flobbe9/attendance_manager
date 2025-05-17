import { SchoolclassMode } from "./SchoolclassMode";
import { SCHOOL_SUBJECTS, SchoolSubject_Key, schoolSubjectKeysObj, schoolSubjectValuesObj } from "./SchoolSubject";


const examinantKeysObject = {
    "educator": SCHOOL_SUBJECTS.length,
    "headmaster": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type Examinant_Key = keyof typeof examinantKeysObject | SchoolSubject_Key;
export const EXAMINANT_KEYS: Examinant_Key[] = Object.keys(examinantKeysObject) as Examinant_Key[]; 


const examinantValuesObj = {
    "Pädagoge": SCHOOL_SUBJECTS.length,
    "Schulleitung": SCHOOL_SUBJECTS.length + 1
}
/**
 *  @since 0.0.1
 */
export type Examinant = keyof typeof examinantValuesObj | SchoolSubject_Key;
export const EXAMINANTS: Examinant[] = Object.keys(examinantValuesObj) as Examinant[]; 
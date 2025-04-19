export const schoolclassModeKeysObj = {
    "ownClass": 0, 
    "othersClass": 1,
};
export type SchoolclassMode_Key = keyof typeof schoolclassModeKeysObj;
export const SCHOOLCLASS_MODE_KEYS: SchoolclassMode_Key[] = Object.keys(schoolclassModeKeysObj) as SchoolclassMode_Key[]; 

export const schoolclassModeObj = {
    "Eigenverantwortlicher Unterricht": 0, 
    "Ausbildungsunterricht": 1
};
/**
 * Describes the responsibility of the teacher towards the school class the lesson is held in.
 *  
 *  @since 0.0.1
 */
export type SchoolclassMode = keyof typeof schoolclassModeObj;
export const SCHOOLCLASS_MODES: SchoolclassMode[] = Object.keys(schoolclassModeObj) as SchoolclassMode[]; 
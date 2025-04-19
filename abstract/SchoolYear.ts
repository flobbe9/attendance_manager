export const schoolYearObj: Readonly<Record<string, SchoolYearSection>> = {
    "5": "sek1",
    "6": "sek1",
    "7": "sek1",
    "8": "sek1",
    "9": "sek1",
    "10": "sek1",
    "11": "sek2",
    "12": "sek2",
    "13": "sek2"
};
type Type = typeof schoolYearObj;

/**
 *  @since 0.0.1
*/
export type SchoolYear = keyof Type;
export const SCHOOL_YEARS: SchoolYear[] = Object.keys(schoolYearObj) as SchoolYear[]; 

export type SchoolYearSection = "sek1" | "sek2";
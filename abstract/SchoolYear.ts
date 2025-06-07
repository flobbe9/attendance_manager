import { isBlank, isEmpty } from "@/utils/utils";

export const schoolYearObj = {
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

/**
 *  @since 0.0.1
*/
export type SchoolYear = keyof typeof schoolYearObj;
export const SCHOOL_YEARS: SchoolYear[] = Object.keys(schoolYearObj) as SchoolYear[]; 

export type SchoolYearSection = "sek1" | "sek2";


export function isSchoolYear(value: string): value is SchoolYear {

    return SCHOOL_YEARS.includes(value as any);
}


export function mightBecomeSchoolYear(value: string): boolean {

    return isEmpty(value) || 
        (value.length === 1 && value === "1") ||
        isSchoolYear(value);
}
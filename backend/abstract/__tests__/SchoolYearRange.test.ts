import { SchoolYear } from "@/abstract/SchoolYear";
import { isWithinSchoolYearRange, SchoolYearRange } from "../SchoolYearRange"
import { isStringFalsy } from "@/utils/utils";
import { parseNumOrReturnNull, parseNumOrThrow } from "@/utils/projectUtils";


describe("isWithingSchoolYearRange", () => {
    
    test("Falsy params should throw", () => {

        expect(() => isWithinSchoolYearRange(null, { min: "5", max: "6"})).toThrow(); 
        expect(() => isWithinSchoolYearRange("10", null)).toThrow();
        expect(() => isWithinSchoolYearRange(null, null)).toThrow();
        expect(() => isWithinSchoolYearRange("a" as SchoolYear, { min: "5", max: "6"})).toThrow(); 
    })

        
    test("Falsy range should not throw", () => {

        const nonNumber = "a" as SchoolYear;

        expect(isWithinSchoolYearRange("5", { min: nonNumber, max: "6"})).toBe(true);
        expect(isWithinSchoolYearRange("5", { min: null, max: "6"})).toBe(true);
        expect(isWithinSchoolYearRange("7", { min: nonNumber, max: "6"})).toBe(false);

        expect(isWithinSchoolYearRange("5", { min: "6", max: nonNumber})).toBe(false);
        expect(isWithinSchoolYearRange("5", { min: "6", max: null})).toBe(false);
        expect(isWithinSchoolYearRange("7", { min: "6", max: nonNumber})).toBe(true);
    })


    test("InclusiveEdges - should be within range", () => {
        const schoolYearRange: SchoolYearRange = {
            min: "5",
            max: "10"
        }    

        // make sure min and max differ
        expect(schoolYearRange.min !== schoolYearRange.max).toBe(true);

        expect(isWithinSchoolYearRange(schoolYearRange.min, schoolYearRange, true)).toBe(true);
        expect(isWithinSchoolYearRange(schoolYearRange.max, schoolYearRange, true)).toBe(true);
        expect(isWithinSchoolYearRange("7", schoolYearRange, true)).toBe(true);
    })
    

    test("InclusiveEdges - should not be within range", () => {
        const schoolYearRange: SchoolYearRange = {
            min: "6",
            max: "10"
        }    

        // make sure min and max differ
        expect(schoolYearRange.min !== schoolYearRange.max).toBe(true);

        expect(isWithinSchoolYearRange("5", schoolYearRange, true)).toBe(false);
        expect(isWithinSchoolYearRange("11", schoolYearRange, true)).toBe(false);
    })
    

    test("Non inclusiveEdges - should be within range", () => {
        const schoolYearRange: SchoolYearRange = {
            min: "5",
            max: "10"
        }    

        // make sure min and max differ
        expect(schoolYearRange.min !== schoolYearRange.max).toBe(true);

        expect(isWithinSchoolYearRange("6", schoolYearRange, false)).toBe(true);
    })


    test("Non inclusiveEdges - should not be within range", () => {
        const schoolYearRange: SchoolYearRange = {
            min: "5",
            max: "10"
        }    

        // make sure min and max differ
        expect(schoolYearRange.min !== schoolYearRange.max).toBe(true);

        expect(isWithinSchoolYearRange(schoolYearRange.min, schoolYearRange, false)).toBe(false);
        expect(isWithinSchoolYearRange(schoolYearRange.max, schoolYearRange, false)).toBe(false);
    })
})
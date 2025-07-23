import { SchoolYear } from "@/abstract/SchoolYear";
import { isSchoolYearRangeOverlap, isWithinSchoolYearRange, SchoolYearRange } from "../SchoolYearRange"


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


describe("isSchoolYearRangeOverlap", () => {
    test("Should throw if falsy params", () => {
        const validSchoolYearRange: SchoolYearRange = {
            min: "5",
            max: "10"
        }

        expect(() => isSchoolYearRangeOverlap(null, validSchoolYearRange)).toThrow();
        expect(() => isSchoolYearRangeOverlap(validSchoolYearRange, null)).toThrow();
        expect(() => isSchoolYearRangeOverlap(validSchoolYearRange, validSchoolYearRange)).not.toThrow();
    })


    test("Range 1 completely contained withing range 2", () => {
        const range1: SchoolYearRange = {
            min: "7",
            max: "9"
        }
        const range2: SchoolYearRange = {
            min: "5",
            max: "10"
        }

        expect(isSchoolYearRangeOverlap(range1, range2, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range1, range2, false)).toBe(true);
        
        // swap params
        expect(isSchoolYearRangeOverlap(range2, range1, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range2, range1, false)).toBe(true);
    })


    test("Range 1 partially contained withing range 2", () => {
        const range1: SchoolYearRange = {
            min: "7",
            max: "9"
        }
        const range2: SchoolYearRange = {
            min: "8",
            max: "10"
        }

        expect(isSchoolYearRangeOverlap(range1, range2, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range1, range2, false)).toBe(true);
        
        // swap params
        expect(isSchoolYearRangeOverlap(range2, range1, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range2, range1, false)).toBe(true);
    })


    test("Range 1 on edge of range 2", () => {
        const range1: SchoolYearRange = {
            min: "7",
            max: "9"
        }
        const range2: SchoolYearRange = {
            min: "9",
            max: "10"
        }

        expect(isSchoolYearRangeOverlap(range1, range2, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range1, range2, false)).toBe(false);
        
        // swap params
        expect(isSchoolYearRangeOverlap(range2, range1, true)).toBe(true);
        expect(isSchoolYearRangeOverlap(range2, range1, false)).toBe(false);
    })
})
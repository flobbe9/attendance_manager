import { equalsSchoolYearCondition, SchoolYearCondition } from "../SchoolYearCondition"


describe("equalsSchoolYearCondition", () => {

    test("Falsy params", () => {
        const schoolYearCondition: SchoolYearCondition = {
            minAttendances: 0,
            maxAttendances: 0,
            schoolYearRange: undefined
        }

        expect(equalsSchoolYearCondition(null, schoolYearCondition)).toBe(false);
        expect(equalsSchoolYearCondition(schoolYearCondition, null)).toBe(false);

        expect(equalsSchoolYearCondition(undefined, null)).toBe(true);
        expect(equalsSchoolYearCondition(null, null)).toBe(true);
    });


    test("Should compare every field", () => {
        const schoolYearCondition1: SchoolYearCondition = {
            minAttendances: 1,
            maxAttendances: 2,
            schoolYearRange: {
                min: "5",
                max: "10"
            },
            lessonTopic: "history"
        }

        const schoolYearCondition2: SchoolYearCondition = {
            minAttendances: 1,
            maxAttendances: 2,
            schoolYearRange: {
                min: "5",
                max: "10"
            },
            lessonTopic: "history"
        }

        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(true);

        schoolYearCondition1.minAttendances++;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(false);
        schoolYearCondition1.minAttendances--;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(true);

        schoolYearCondition1.maxAttendances++;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(false);
        schoolYearCondition1.maxAttendances--;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(true);
        
        schoolYearCondition1.lessonTopic = "language";
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(false);
        schoolYearCondition1.lessonTopic = schoolYearCondition2.lessonTopic;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(true);

        schoolYearCondition1.schoolYearRange.min = "6";
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(false);
        schoolYearCondition1.schoolYearRange.min = schoolYearCondition2.schoolYearRange.min;
        expect(equalsSchoolYearCondition(schoolYearCondition1, schoolYearCondition2)).toBe(true);
    })
})
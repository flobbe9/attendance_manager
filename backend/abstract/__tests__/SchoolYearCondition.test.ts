import { destructSchoolYearConditions, equalsSchoolYearCondition, equalsSchoolYearConditions, SchoolYearCondition, sortSchoolYearConditionsByRangeSize } from "../SchoolYearCondition"
import { compareSchoolYearRangeSizes, getSchoolYearRangeSize } from "../SchoolYearRange";


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


describe("sortSchoolYearConditionsByRangeSize", () => {

    test("Should throw if arg is falsy", () => {
        expect(() => sortSchoolYearConditionsByRangeSize(null)).toThrow();
    })


    test("Should consider falsy range ends as 0", () => {
        // use min/maxAttendances like indices
        const unsortedConditions: SchoolYearCondition[] = [
            {
                minAttendances: 0,
                maxAttendances: 0,
                schoolYearRange: {
                    min: null,
                    max: null
                }
            },
            // positive range size
            {
                minAttendances: 1,
                maxAttendances: 1,
                schoolYearRange: {
                    min: "11",
                    max: "10"
                }
            },
            {
                minAttendances: 2,
                maxAttendances: 2,
                schoolYearRange: {
                    min: "5",
                    max: "10"
                }
            },
            {
                minAttendances: 3,
                maxAttendances: 3,
                schoolYearRange: {
                    min: null,
                    max: null
                }
            }
        ]

        
        
        const sortedConditions = sortSchoolYearConditionsByRangeSize([...unsortedConditions]);

        // expect invalid range to be at the end
        expect(unsortedConditions[0].minAttendances).toEqual(sortedConditions[2].minAttendances);
        expect(unsortedConditions[3].minAttendances).toEqual(sortedConditions[3].minAttendances);
    })
    

    test("Should consider falsy min as -1", () => {
        const unsortedConditions: SchoolYearCondition[] = [
            {
                minAttendances: 0,
                maxAttendances: 0,
                schoolYearRange: {
                    min: "5",
                    max: "5"
                }
            },
            {
                minAttendances: 1,
                maxAttendances: 1,
                schoolYearRange: {
                    min: null,
                    max: "5"
                }
            },
        ]

        const sortedConditions = sortSchoolYearConditionsByRangeSize([...unsortedConditions]);

        expect(unsortedConditions[1].minAttendances).toBe(sortedConditions[0].minAttendances);
    })
        

    test("Should consider falsy max as 1", () => {
        const unsortedConditions: SchoolYearCondition[] = [
            {
                minAttendances: 0,
                maxAttendances: 0,
                schoolYearRange: {
                    min: "10",
                    max: null
                }
            },
            {
                minAttendances: 1,
                maxAttendances: 1,
                schoolYearRange: {
                    min: "10",
                    max: "10"
                }
            },
        ]

        const sortedConditions = sortSchoolYearConditionsByRangeSize([...unsortedConditions]);

        expect(unsortedConditions[0].minAttendances).toBe(sortedConditions[1].minAttendances);
    })


    test("Should sort ascending", () => {
        const unsortedConditions: SchoolYearCondition[] = [
            // diff 3
            {
                minAttendances: 0,
                maxAttendances: 0,
                schoolYearRange: {
                    min: "10",
                    max: "13"
                }
            },
            // diff 1
            {
                minAttendances: 1,
                maxAttendances: 1,
                schoolYearRange: {
                    min: "9",
                    max: "10"
                }
            },
            // diff 0
            {
                minAttendances: 2,
                maxAttendances: 2,
                schoolYearRange: {
                    min: "10",
                    max: "10"
                }
            },
            // diff -1
            {
                minAttendances: 3,
                maxAttendances: 3,
                schoolYearRange: {
                    min: "11",
                    max: "10"
                }
            },
        ]

        const sortedConditions = sortSchoolYearConditionsByRangeSize([...unsortedConditions]);

        expect(unsortedConditions[3].minAttendances).toBe(sortedConditions[0].minAttendances);
        expect(unsortedConditions[2].minAttendances).toBe(sortedConditions[1].minAttendances);
        expect(unsortedConditions[1].minAttendances).toBe(sortedConditions[2].minAttendances);
        expect(unsortedConditions[0].minAttendances).toBe(sortedConditions[3].minAttendances);
    })
});


describe("destructSchoolYearConditions", () => {

    test("Falsy params should throw", () => {

        expect(() => destructSchoolYearConditions(null)).toThrow();
        expect(() => destructSchoolYearConditions([])).not.toThrow();
    })


    test("Empty conditions should return []", () => {

        expect(destructSchoolYearConditions([]).length).toBe(0);
    })


    test("Should destruct and set min to 1", () => {
        const conditions: SchoolYearCondition[] = [
            {
                minAttendances: 3,
                maxAttendances: 5,
                schoolYearRange: undefined
            },
            {
                minAttendances: 1,
                maxAttendances: 5,
                schoolYearRange: undefined
            }
        ];

        const destructedConditions = destructSchoolYearConditions(conditions);
        expect(destructedConditions.length).toBe(conditions[0].minAttendances + conditions[1].minAttendances);

        expect(destructedConditions[0].minAttendances).toBe(1);
        expect(destructedConditions[1].minAttendances).toBe(1);
        expect(destructedConditions[2].minAttendances).toBe(1);
        expect(destructedConditions[3].minAttendances).toBe(1);
    })

    test("Falsy minAttendances should not modify", () => {
        const conditions: SchoolYearCondition[] = [
            {
                minAttendances: null,
                maxAttendances: 5,
                schoolYearRange: undefined
            },
            {
                minAttendances: 1,
                maxAttendances: 5,
                schoolYearRange: undefined
            }
        ];

        const destructedConditions = destructSchoolYearConditions(conditions);

        expect(equalsSchoolYearConditions(conditions, destructedConditions)).toBe(true);
    })
})
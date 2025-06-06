import { defaultEquals } from "../projectUtils"


describe("defaultEquals", () => {
    test("Falsy params - ignore distinct falsy values", () => {
        expect(defaultEquals(null, undefined)).toBe(true);
        expect(defaultEquals(null, null)).toBe(true);

        expect(defaultEquals(null, "not falsy")).toBe(false);
        expect(defaultEquals("not falsy", null)).toBe(false);
    })


    test("Falsy params - consider distinct falsy values", () => {
        expect(defaultEquals(null, undefined, true)).toBe(false);
        expect(defaultEquals(null, null, true)).toBe(true);

        expect(defaultEquals(null, "not falsy", true)).toBe(false);
        expect(defaultEquals("not falsy", null, true)).toBe(false);
    })


    test("Should work", () => {
        expect(defaultEquals(1, 2)).toBe(false);
        expect(defaultEquals(1, 1)).toBe(true);

        expect(defaultEquals("a", "b")).toBe(false);
        expect(defaultEquals("a", "a")).toBe(true);

        // should compare references
        expect(defaultEquals({test: 1}, {test: 1})).toBe(false);
    })
})
import {ExaminantRole_Key} from "@/abstract/Examinant";
import {ExaminantService} from "../ExaminantService";
import { ExaminantEntity } from "@/backend/entities/ExaminantEntity";

describe("isModified", () => {
    const examinantService = new ExaminantService();

    test("basic comparison by id", () => {
        const examinant1: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        };
        const examinant2: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "namee",
        };

        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        expect(examinantService.isModified(examinant1, examinant1)).toBe(false);
    });

    test("should be true if at least one field is modified", () => {
        const examinant1: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        };
        const examinant2: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        };

        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);

        examinant2.role = "music";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.role = "history";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);

        // dont include attendanceId
        examinant2.attendanceId = 2;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);
        examinant2.attendanceId = 1;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);

        examinant2.fullName = "namee";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.fullName = "name";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);
    });
});

describe("sortByRole", () => {
    const examinantService = new ExaminantService();

    test("Falsy arg should return empty array", () => {
        expect(examinantService.sortByRole(null).length).toBe(0);
        expect(examinantService.sortByRole(undefined).length).toBe(0);
    });

    test("Should sort correctly for unsorted input", () => {
        const unsortedExaminants: ExaminantEntity[] = [
            {
                role: "educator",
            },
            {
                role: "headmaster",
            },
            {
                role: "music",
            },
            {
                role: "history",
            },
        ];

        expect(isSortOrderValid(unsortedExaminants)).toBe(false);

        const sortedExaminants = examinantService.sortByRole(unsortedExaminants);
        expect(isSortOrderValid(sortedExaminants)).toBe(true);
    });

    test("Should sort correctly for sorted input", () => {
        const unsortedExaminants: ExaminantEntity[] = [
            {
                role: "history",
            },
            {
                role: "music",
            },
            {
                role: "educator",
            },
            {
                role: "headmaster",
            },
        ];

        expect(isSortOrderValid(unsortedExaminants)).toBe(true);

        const sortedExaminants = examinantService.sortByRole(unsortedExaminants);
        expect(isSortOrderValid(sortedExaminants)).toBe(true);
    });

    test("Should not throw on sort empty", () => {
        const emptyExaminants: ExaminantEntity[] = [];

        expect(examinantService.sortByRole(emptyExaminants).length).toBe(0);
    });

    /**
     * Assume all examinant roles are present at least once. Does not test if equal roles are next to eachother.
     *
     * @param examinantEntities
     * @returns
     */
    function isSortOrderValid(examinantEntities: ExaminantEntity[]): boolean {
        if (!examinantEntities) return true;

        const musicExaminantIndex = getExaminantIndex(examinantEntities, "music");
        const historyExaminantIndex = getExaminantIndex(examinantEntities, "history");
        const educatorExaminantIndex = getExaminantIndex(examinantEntities, "educator");
        const headmasterExaminantIndex = getExaminantIndex(examinantEntities, "headmaster");

        return (
            historyExaminantIndex < musicExaminantIndex &&
            musicExaminantIndex < educatorExaminantIndex &&
            educatorExaminantIndex < headmasterExaminantIndex
        );
    }

    function getExaminantIndex(
        examinantEntities: ExaminantEntity[],
        role: ExaminantRole_Key
    ): number {
        if (!examinantEntities) return -1;

        let index = -1;

        examinantEntities.find((examinantEntity, i) => {
            const isMatch = examinantEntity.role === role;

            if (isMatch) index = i;

            return isMatch;
        });

        return index;
    }
});

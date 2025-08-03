import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { ExaminantEntity } from "@/backend/entities/ExaminantEntity";
import {AbstractRepository} from "../AbstractRepository";

describe("fixEmptyColumnValues", () => {
    // falsy param
    // only non-object values
    // object value
    // array value

    test("Should not throw if param is falsy", () => {
        const entity: ExaminantEntity = null;

        expect(() => AbstractRepository.fixEmptyColumnValues(entity)).not.toThrow();
    });

    test("Should fix primitive field values from undefined to null", () => {
        const entity: ExaminantEntity = {
            id: 1,
            role: undefined,
        };

        expect(entity.role).toBeUndefined();
        expect(entity.id).toBe(1);

        const fixedEntity = AbstractRepository.fixEmptyColumnValues(entity);

        // should have fixed role
        expect(fixedEntity.role).toBeNull();
        // should not touch non-falsy values
        expect(fixedEntity.id).toBe(1);
    });

    test("Should fix related entities' field values from undefined to null", () => {
        const entity: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: undefined,
            schoolclassMode: {
                id: 1,
                mode: undefined,
            },
        };

        expect(entity.schoolclassMode.mode).toBeUndefined();
        expect(entity.examinants).toBeUndefined();
        expect(entity.schoolclassMode.id).toBe(1);

        const fixedEntity = AbstractRepository.fixEmptyColumnValues(entity);

        // should have fixed role
        expect(fixedEntity.schoolclassMode.mode).toBeNull();
        expect(fixedEntity.examinants).toBeNull();
        // should not touch non-falsy values
        expect(fixedEntity.schoolclassMode.id).toBe(1);
    });

    test("Should fix related entities' field values from undefined to null", () => {
        const entity: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [
                {
                    role: undefined,
                },
                {
                    role: "history",
                },
            ],
            schoolclassMode: null,
        };

        expect(entity.examinants[0].role).toBeUndefined();
        expect(entity.examinants[1].role).toBe("history");

        const fixedEntity = AbstractRepository.fixEmptyColumnValues(entity);

        expect(fixedEntity.examinants[0].role).toBeNull();
        expect(fixedEntity.examinants[1].role).toBe("history");
    });
});

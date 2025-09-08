import { assertFalsyAndThrow, cloneObj } from "@/utils/utils";
import { DbBackupDto } from "../DbBackupDto";
import { isDbBackupDto } from "@/backend/abstract/DbBackupDto";

describe("isDbBackupDto", () => {
    test("should be false", () => {
        const dto: DbBackupDto = {
            entities: {
                allAttendanceEntities: [],
                allSchoolclassModeEntities: [],
                allExaminantEntities: [],
            },
            metadata: {
                migrationKey: "",
                created: new Date(),
                appVersion: "",
                mode: "auto",
                os: "ios",
            },
        };

        let dtoClone = cloneObj(dto);
        delete dtoClone["entities"];
        expect(Object.hasOwn(dtoClone, "entities")).toBe(false);
        expect(isDbBackupDto(dtoClone)).toBe(false);
        dtoClone = cloneObj(dto);
        expect(Object.hasOwn(dtoClone, "entities")).toBe(true);

        assertDeleteDtoProp(dto, "metadata", false);
    });

    test("should be true", () => {
        const dto: DbBackupDto = {
            entities: {
                allAttendanceEntities: [],
                allSchoolclassModeEntities: [],
                allExaminantEntities: [],
            },
            metadata: {
                migrationKey: "",
                created: new Date(),
                appVersion: "",
                mode: "auto",
                os: "ios",
            },
        };

        expect(isDbBackupDto(dto)).toBe(true);
        assertDeleteDtoProp(dto, "entities", true);
    })

    /**
     * Iterate `dtoIterationObjectKey` and delete each key, then assert `isDbBackupDto`.
     * 
     * @param dto mock dto
     * @param dtoIterationObjectKey key of the object to iterate and delete keys of
     * @param deletedShouldStillBeValid whether the dto is expected to "beADto" even without the deleted prop
     */
    function assertDeleteDtoProp(dto: DbBackupDto, dtoIterationObjectKey: string, deletedShouldStillBeValid: boolean) {
        assertFalsyAndThrow(dto, dtoIterationObjectKey);

        let dtoClone = cloneObj(dto);
        Object.keys(dtoClone[dtoIterationObjectKey]).forEach((key) => {
            delete dtoClone[dtoIterationObjectKey][key];
            expect(Object.hasOwn(dtoClone[dtoIterationObjectKey], key)).toBe(false);
            expect(isDbBackupDto(dtoClone)).toBe(deletedShouldStillBeValid);
            dtoClone = cloneObj(dto);
            expect(Object.hasOwn(dtoClone[dtoIterationObjectKey], key)).toBe(true);
        })
    }
});

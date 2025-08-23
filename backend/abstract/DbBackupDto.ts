import { OS } from "@/abstract/OS";
import { assertFalsyAndThrow, isBlank } from "@/utils/utils";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";
import { SchoolclassModeEntity } from "../entities/SchoolclassModeEntity";
import AbstractEntity from "./AbstractEntity";
import { PrettyError } from "@/abstract/PrettyError";

/**
 * Wrapper object defining what's stored for db backup. Make sure to explicitly include
 * owned related entities because entities wont be persisted using cascade.
 *
 * NOTE: don't forget to add new date fields to the parsing method as well
 *
 * @since 0.2.2
 */
export interface DbBackupDto {
    entities: {
        allAttendanceEntities: AttendanceEntity[];
        allSchoolclassModeEntities: SchoolclassModeEntity[];
        allExaminantEntities: ExaminantEntity[];
    };
    metadata: {
        /** The drizzle/migrations.js key in order to determine if db schemas are compatible */
        migrationKey: string;
        created: Date;
        appVersion: string;
        mode: DbBackupMode;
        os: OS;
    };
}

/**
 * Use `'auto'` for automatic cloud backup and `'manual'` for manual file (from device) backup
 *
 * @since 0.2.4
 */
export type DbBackupMode = "auto" | "manual";

export function isDbBackupDto(dbBackupDto: DbBackupDto): dbBackupDto is DbBackupDto {
    if (!dbBackupDto) return false;

    return (
        Object.hasOwn(dbBackupDto, "metadata") &&
        Object.hasOwn(dbBackupDto.metadata, "migrationKey") &&
        Object.hasOwn(dbBackupDto.metadata, "created") &&
        Object.hasOwn(dbBackupDto.metadata, "appVersion") &&
        Object.hasOwn(dbBackupDto.metadata, "mode") &&
        Object.hasOwn(dbBackupDto.metadata, "os") &&
        Object.hasOwn(dbBackupDto, "entities")
    );
}

/**
 * In addition to calling `JSON.parse`, create `Date` objects for each date timestamp.
 *
 * @param dtoJson TODO: continue here, also test blank dates
 * @returns parsed dto with `Date` objects
 * @throws `PrettyError` 400 if some date value is invalid (not if it's falsy)
 */
export function parseDbBackupDto(dtoJson: string): DbBackupDto {
    try {
        assertFalsyAndThrow(dtoJson);

        const rawDtoObj: DbBackupDto = JSON.parse(dtoJson);

        if (!rawDtoObj.entities) return rawDtoObj;

        const parseAbstractEntityDates = (entity: AbstractEntity): void => {
            parseEntityDate(entity, "created");
            parseEntityDate(entity, "updated");
        };

        /**
         * Only throw if date value is invalid, not if falsy.
         *
         * @param entity
         * @param fieldName of a date property
         * @throws if args are falsy
         */
        const parseEntityDate = <T extends AbstractEntity>(entity: T, fieldName: keyof T): void => {
            assertFalsyAndThrow(entity, fieldName);

            const dateString = entity[fieldName];
            if (typeof dateString === "string") {
                entity[fieldName as string] = isBlank(dateString) ? null : new Date(dateString);
            }
        };

        const created = rawDtoObj.metadata?.created;
        if (typeof created === "string") rawDtoObj.metadata.created = new Date(created);

        if (rawDtoObj.entities.allAttendanceEntities)
            for (const entity of rawDtoObj.entities.allAttendanceEntities) {
                parseAbstractEntityDates(entity);
                parseEntityDate(entity, "date");
            }

        if (rawDtoObj.entities.allAttendanceEntities)
            for (const entity of rawDtoObj.entities.allExaminantEntities) parseAbstractEntityDates(entity);

        if (rawDtoObj.entities.allAttendanceEntities)
            for (const entity of rawDtoObj.entities.allSchoolclassModeEntities)
                parseAbstractEntityDates(entity);

        return rawDtoObj;
    } catch (e) {
        throw PrettyError.parseError(
            e,
            `Die BackupDatei ist korrupt. Erstelle eine neue Backupdatei und versuche es dann erneut.`,
            400
        );
    }
}

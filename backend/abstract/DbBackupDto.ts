import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";
import { SchoolclassModeEntity } from "../entities/SchoolclassModeEntity";
import AbstractEntity from "./AbstractEntity";

/**
 * Wrapper object defining what's stored for db backup. Make sure to explicitly include
 * owned related entities as entities wont be persisted using cascade.
 *
 * @since 0.2.2
 */
export interface DbBackupDto {
    /** The latest drizlle/migrations.js key in order to determine if db schemas are compatible */
    latestMigration: string;
    entities: {
        allAttendanceEntities: AttendanceEntity[];
        allSchoolclassModeEntities: SchoolclassModeEntity[];
        allExaminantEntities: ExaminantEntity[];
    }
}

export function isDbBackupDto(dbBackupDto: DbBackupDto): dbBackupDto is DbBackupDto {
    if (!dbBackupDto) return false;

    return (
        Object.hasOwn(dbBackupDto, "latestMigration") &&
        Object.hasOwn(dbBackupDto, "entities") && dbBackupDto.entities &&
        Object.hasOwn(dbBackupDto.entities, "allAttendanceEntities") &&
        Object.hasOwn(dbBackupDto.entities, "allSchoolclassModeEntities") &&
        Object.hasOwn(dbBackupDto.entities, "allExaminantEntities")
    );
}

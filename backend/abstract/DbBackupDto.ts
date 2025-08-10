import { SchoolclassMode } from "@/abstract/SchoolclassMode";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";

/**
 * Wrapper object defining what's stored for db backup.
 *
 * @since 0.2.2
 */
export interface DbBackupDto {
    // latestMigration: "m0000"
    attendances: AttendanceEntity[];
    schoolclassModes: SchoolclassMode[];
    examinants: ExaminantEntity[];
}

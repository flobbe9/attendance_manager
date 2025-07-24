import { SchoolclassMode } from "@/abstract/SchoolclassMode";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";

/**
 * Wrapper object defining what's stored for db backup.
 * 
 * @since latest
 */
export interface DbBackupDto {
    attendances: AttendanceEntity[],
    schoolclassModes: SchoolclassMode[],
    examinants: ExaminantEntity[]
}
import {AttendanceRepository} from "@/backend/repositories/AttendanceRepository";
import {useDao} from "@/backend/useDao";
import { Attendance_Table } from "@/backend/schemas/AttendanceSchema";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";

/**
 * @returns all default db instances as well as the entity specific repository
 * @since 0.0.1
 */
export function useAttendanceRepository() {
    const {dao, db, sqliteDb} = useDao<AttendanceEntity>(Attendance_Table);
    const attendanceRepository = new AttendanceRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        attendanceRepository,
    };
}

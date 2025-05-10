import { Attendance_Table, AttendanceEntity } from "@/backend/DbSchema";
import { AttendanceRepository } from "@/backend/repositories/AttendanceRepository";
import { useDao } from "@/backend/useDao";


/**
 * @returns all default db instances as well as the entity specific repository
 * @since 0.0.1
 */
export function useAttendanceRepository() {

    const { dao, db, sqliteDb } = useDao<AttendanceEntity>(Attendance_Table);
    const attendanceRespository = new AttendanceRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        attendanceRespository
    }
}
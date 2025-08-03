import {relations} from "drizzle-orm";
import {Attendance_Table} from "./AttendanceSchema";
import {Examinant_Table} from "./ExaminantSchema";

export const Examinant_Relations = relations(Examinant_Table, ({one}) => ({
    attendance: one(Attendance_Table),
}));

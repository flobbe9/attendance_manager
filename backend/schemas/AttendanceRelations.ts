import {relations} from "drizzle-orm";
import {Attendance_Table} from "./AttendanceSchema";
import {Examinant_Table} from "./ExaminantSchema";
import {SchoolclassMode_Table} from "./SchoolclassModeSchema";

export const Attendance_Relations = relations(Attendance_Table, ({many, one}) => ({
    examinants: many(Examinant_Table),
    schoolclassMode: one(SchoolclassMode_Table),
}));

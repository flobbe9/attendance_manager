import { EXAMINANT_ROLE_KEYS, ExaminantRole_Key } from "@/abstract/Examinant";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Abstract_Table } from "./AbstractSchema";
import { Attendance_Table } from "./AttendanceSchema";

const TableNameValue = "examinant";

export const Examinant_Table = sqliteTable(TableNameValue, {
    ...Abstract_Table,
    role: text({ enum: EXAMINANT_ROLE_KEYS as [ExaminantRole_Key] }).notNull(),
    fullName: text(),
    attendanceId: integer("attendance_id")
        .notNull()
        .references(() => Attendance_Table.id, { onDelete: "cascade" }),
});

import { SCHOOLCLASS_MODE_KEYS, SchoolclassMode_Key } from "@/abstract/SchoolclassMode";
import { relations } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";
import { integer } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { Abstract_Table } from "../abstract/Abstract_Schema";
import { Attendance_Table } from "./AttendanceSchema";

const TableNameValue = "schoolclass_mode";

export const SchoolclassMode_Table = sqliteTable(TableNameValue, {
    ...Abstract_Table,
    mode: text({enum: SCHOOLCLASS_MODE_KEYS as [SchoolclassMode_Key]}).notNull(),
    fullName: text(),
    attendanceId: integer()
        .notNull()
        .references(() => Attendance_Table.id, {onDelete: "cascade"}),
});

export const SchoolclassMode_Relations = relations(SchoolclassMode_Table, ({one}) => ({
    attendance: one(Attendance_Table),
    // test: one(Test_Table)
}));

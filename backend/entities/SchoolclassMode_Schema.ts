import { SCHOOLCLASS_MODE_KEYS, SchoolclassMode, SchoolclassMode_Key } from "@/abstract/SchoolclassMode";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { AbstractEntity_Table } from "../abstract/AbstractEntity_Schema";
import { Attendance_Table } from "./Attendance_Schema";

type TableName = "SchoolclassMode";
const TableNameValue: TableName = "SchoolclassMode";


export const SchoolclassMode_Table = sqliteTable(
    TableNameValue, 
    {
        ...AbstractEntity_Table,
        mode: text({ enum: SCHOOLCLASS_MODE_KEYS as [SchoolclassMode_Key]}).notNull(),
        fullName: text("full_name"),
        attendanceId: integer("attendance_id")
            .notNull()
            .references(() => Attendance_Table.id)
    },
);


// export const SchoolclassMode_Relations = relations(
//     SchoolclassMode_Table,
//     ({one}) => ({
//         attendance: one(Attendance_Table)
//     })
// )


/**
 * @since 0.0.1
 * @see SchoolclassMode
 */
export interface SchoolclassModeEntity extends AbstractEntity {

    mode: SchoolclassMode_Key,
    /** Name of the teacher responsible for the attended class in case the mode is not "ownClass" */
    fullName?: string,
    attendanceId?: number
}

import { SCHOOLCLASS_MODE_KEYS, SchoolclassMode_Key } from "@/abstract/SchoolclassMode";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { Abstract_Table } from "../abstract/Abstract_Schema";
import { Attendance_Table } from "./Attendance_Schema";


const TableNameValue = "schoolclass_mode";


export const SchoolclassMode_Table = sqliteTable(
    TableNameValue, 
    {
        ...Abstract_Table,
        mode: text({ enum: SCHOOLCLASS_MODE_KEYS as [SchoolclassMode_Key]}).notNull(),
        fullName: text(),
        attendanceId: integer()
            .notNull()
            .references(() => Attendance_Table.id, {onDelete: 'cascade'})
    },
);


export const SchoolclassMode_Relations = relations(
    SchoolclassMode_Table,
    ({one}) => ({
        attendance: one(Attendance_Table),
        // test: one(Test_Table)
    })
)


/**
 * @since 0.0.1
 * @see SchoolclassMode
 */
export class SchoolclassModeEntity extends AbstractEntity {

    mode: SchoolclassMode_Key;
    /** Name of the teacher responsible for the attended class in case the mode is not "ownClass" */
    fullName?: string;
    attendanceId?: number;
}

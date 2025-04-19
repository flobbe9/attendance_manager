import { Examinant, Examinant_Key, EXAMINANT_KEYS } from "@/abstract/Examinant";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { AbstractEntity_Table } from "../abstract/AbstractEntity_Schema";
import { Attendance_Table } from "./Attendance_Schema";

type TableName = "Examinant";
const TableNameValue: TableName = "Examinant";


export const Examinant_Table = sqliteTable(
    TableNameValue, 
    {
        ...AbstractEntity_Table,
        role: text({ enum: EXAMINANT_KEYS as [Examinant_Key]}).notNull(),
        fullName: text("full_name"),
        attendanceId: integer("attendance_id")
            .notNull()
            .references(() => Attendance_Table.id, {onDelete: 'cascade', onUpdate: 'cascade'})
    },
);


export const Examinant_Relations = relations(
    Examinant_Table,
    ({one}) => ({
        attendance: one(Attendance_Table)
    })
)


/**
 * @since 0.0.1
 */
export interface ExaminantEntity extends AbstractEntity {

    /** The type of examinant. See {@link Examinant} */
    role: Examinant_Key,
    fullName: string | null,
    attendanceId: number
}

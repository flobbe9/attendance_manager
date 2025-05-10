import { Examinant, Examinant_Key, EXAMINANT_KEYS } from "@/abstract/Examinant";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { Abstract_Table } from "../abstract/Abstract_Schema";
import { Attendance_Table } from "./Attendance_Schema";

const TableNameValue = "examinant";


export const Examinant_Table = sqliteTable(
    TableNameValue, 
    {
        ...Abstract_Table,
        role: text({ enum: EXAMINANT_KEYS as [Examinant_Key]}).notNull(),
        fullName: text(),
        attendanceId: integer("attendance_id")
            .notNull()
            .references(() => Attendance_Table.id, {onDelete: 'cascade'})
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
export class ExaminantEntity extends AbstractEntity {

    /** The type of examinant. See {@link Examinant} */
    role: Examinant_Key;
    fullName?: string;
    attendanceId?: number;
}

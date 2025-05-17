import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { Abstract_Table } from "../abstract/Abstract_Schema";
import { Attendance_Table } from "./Attendance_Schema";
import { EXAMINANT_ROLE_KEYS, ExaminantRole_Key } from "@/abstract/Examinant";

const TableNameValue = "examinant";


export const Examinant_Table = sqliteTable(
    TableNameValue, 
    {
        ...Abstract_Table,
        role: text({ enum: EXAMINANT_ROLE_KEYS as [ExaminantRole_Key]}).notNull(),
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
    role: ExaminantRole_Key;
    fullName?: string;
    attendanceId?: number;
}

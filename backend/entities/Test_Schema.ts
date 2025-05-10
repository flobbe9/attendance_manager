import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { Abstract_Table } from "../abstract/Abstract_Schema";
import { SchoolclassMode_Table } from "./SchoolclassMode_Schema";
import { relations } from "drizzle-orm";

// TODO: remove eventually
export const Test_Table = sqliteTable(
    "test", 
    {
        ...Abstract_Table,
        someText: text(),
        schoolclassModeId: integer()
            .references(() => SchoolclassMode_Table.id)
    }
);


export const Test_Relations = relations(
    Test_Table,
    ({one}) => ({
        schoolclassMode: one(SchoolclassMode_Table)
    })
)




export interface TestEntity extends AbstractEntity {

    someText: string | null
}
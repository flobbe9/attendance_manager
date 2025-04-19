import { sqliteTable, SQLiteTextBuilderInitial, text } from "drizzle-orm/sqlite-core";
import { AbstractEntity_Schema, AbstractEntity_Table } from "../abstract/AbstractEntity_Schema";

type TableName = "User";
const TableNameValue: TableName = "User";

export class User_Schema extends AbstractEntity_Schema<TableName> {

    first_name: SQLiteTextBuilderInitial<TableName, [string, ...string[]], undefined>
}

/**
 * @since 0.0.1
 */
export const userTable = sqliteTable(TableNameValue, {
    ...AbstractEntity_Table,
    first_name: text().notNull()
});
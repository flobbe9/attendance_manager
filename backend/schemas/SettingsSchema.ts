import { SQL_BLOB_SIZE } from "@/utils/constants";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Abstract_Table } from "./AbstractSchema";

const SETTINGS_TABLE_NAME = "settings";

/**
 * @since 0.0.1
 */
export const Settings_Table = sqliteTable(SETTINGS_TABLE_NAME, {
    ...Abstract_Table,
    key: text().unique().notNull(),
    value: text({ length: SQL_BLOB_SIZE }),
});

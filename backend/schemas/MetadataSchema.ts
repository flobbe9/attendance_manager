import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Abstract_Table } from "./AbstractSchema";
import { METADATA_KEYS, MetadataKey } from "../abstract/MetadataKey";
import { SQL_BLOB_SIZE } from "@/utils/constants";

const METADATA_TABLE_NAME = "metadata";

/**
 * @since latest
 */
export const Metadata_Table = sqliteTable(METADATA_TABLE_NAME, {
    ...Abstract_Table,
    key: text({ enum: METADATA_KEYS as [MetadataKey] })
        .notNull()
        .unique(),
    value: text({ length: SQL_BLOB_SIZE }),
});

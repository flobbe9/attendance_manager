import { HasDefault, IsPrimaryKey, NotNull } from "drizzle-orm";
import { integer, SQLiteIntegerBuilderInitial } from "drizzle-orm/sqlite-core";

/**
 * @since 0.0.1
 */
export abstract class AbstractEntity_Schema<TName extends string> {

    id: IsPrimaryKey<HasDefault<NotNull<SQLiteIntegerBuilderInitial<TName>>>>;
    
    created: NotNull<SQLiteIntegerBuilderInitial<TName>>;

    updated: NotNull<SQLiteIntegerBuilderInitial<TName>>;
}


/**
 * @since 0.0.1
 */
export const abstractEntityTable = {
    id: integer().primaryKey({autoIncrement: true}),
    created: integer({ mode: 'timestamp_ms' }).notNull(),
    updated: integer({ mode: 'timestamp_ms' }).notNull()
}

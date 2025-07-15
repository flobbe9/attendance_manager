import { HasDefault, IsPrimaryKey, NotNull } from "drizzle-orm";
import { integer, SQLiteIntegerBuilderInitial } from "drizzle-orm/sqlite-core";


/**
 * @since 0.0.1
 */
export abstract class Abstract_Schema<TName extends string> {

    id: IsPrimaryKey<HasDefault<NotNull<SQLiteIntegerBuilderInitial<TName>>>>;
    
    created: NotNull<SQLiteIntegerBuilderInitial<TName>>;

    updated: NotNull<SQLiteIntegerBuilderInitial<TName>>;
}


/**
 * @since 0.0.1
 */
export const Abstract_Table = {

    id: integer().primaryKey({autoIncrement: true}),
    created: integer({ mode: 'timestamp_ms' }).notNull(),
    updated: integer({ mode: 'timestamp_ms' }).notNull()
}


/**
 * Dont add class methods as entities are rarely instantiated by constructor.
 *  
 * @since 0.0.1
 */
export default abstract class AbstractEntity {

    id?: number;

    created?: Date;

    updated?: Date;
}
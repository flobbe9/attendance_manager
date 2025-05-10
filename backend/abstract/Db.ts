import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { SQLiteRunResult } from "expo-sqlite";


/**
 * Equivalent to an enititmanager, should give a db instance the basic crud methods.
 * 
 * @since 0.0.1
 */
export type Db<TSchema extends Record<string, unknown> = Record<string, never>> = BaseSQLiteDatabase<"sync", SQLiteRunResult, TSchema>;
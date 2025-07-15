import { Dao } from "@/backend/abstract/Dao";
import { DRIZZLE_DB_CONFIG } from "@/utils/constants";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { useSQLiteContext } from "expo-sqlite";
import AbstractEntity from "./abstract/Abstract_Schema";
import { log } from "@/utils/logUtils";


/**
 * Any database implementation should use this hook to get a db instance.
 * 
 * @returns a new instance of ```Dao``` to perform any db actions
 * @since 0.0.1
 */
export function useDao<Entity extends AbstractEntity>(table: SQLiteTableWithColumns<any>) {

    const sqliteDb = useSQLiteContext();
    sqliteDb.execSync("PRAGMA FOREIGN_KEYS = ON"); // enable cascade

    const db = drizzle(sqliteDb, DRIZZLE_DB_CONFIG);

    return {
        dao: new Dao<Entity>(db, table),
        sqliteDb,
        db
    };
}
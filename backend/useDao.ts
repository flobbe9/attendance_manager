import { Dao } from "@/backend/abstract/Dao";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { useSQLiteContext } from "expo-sqlite";
import AbstractEntity from "./abstract/Abstract_Schema";
import { DRIZZLE_DB_CONFIG } from "@/utils/constants";

/**
 * @returns a new instance of ```Dao``` to perform any db actions
 * @since 0.0.1
 */
export function useDao<Entity extends AbstractEntity, Table extends SQLiteTableWithColumns<any>>(table: Table) {

    const db = useSQLiteContext();
    db.execSync("PRAGMA FOREIGN_KEYS = ON"); // enable cascade

    const drizzleDb = drizzle(db, DRIZZLE_DB_CONFIG);
    
    return {
        dao: new SimpleDaoImpl<Entity, Table>(drizzleDb, table),
        db,
        drizzleDb
    };
}

/**
 * This classes' only purpose is to instantiate a ```new Dao```. Don't export this, use ```useDao``` instead.
 * 
 * @since 0.0.1 
 */
class SimpleDaoImpl<Entity extends AbstractEntity, Table extends SQLiteTableWithColumns<any>> extends Dao<Entity, Table> {}
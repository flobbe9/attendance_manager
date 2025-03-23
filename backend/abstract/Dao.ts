import AbstractEntity from "@/abstract/entities/AbstractEntity";
import { log } from "@/utils/logUtils";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Basically an equivalent of calling ```drizzle()``` with slight modifications.
 * 
 * Use this for any database actions instead of calling ```drizzle()```.
 * 
 * Use ```useDao()``` hook to instantiate this.
 * 
 * @since 0.0.1
 */
export abstract class Dao<Entity extends AbstractEntity, Table extends SQLiteTableWithColumns<any>> {

    private db: ExpoSQLiteDatabase<Record<string, never>> & {$client: SQLiteDatabase};
    private table: Table;


    constructor(db: ExpoSQLiteDatabase<Record<string, never>> & {$client: SQLiteDatabase}, table: Table) {

        this.db = db;
        this.table = table;
    }


    insertValues(values: Entity) {

        values.created = new Date();
        values.updated = new Date();

        return this.db.insert(this.table).values(values);
    }
    

    update(values: Entity) {

        values.updated = new Date();
        
        return this.db.update(this.table).set(values);
    }


    selectFrom() {

        return this.db.select().from(this.table);
    }


    delete() {

        return this.db.delete(this.table);
    }
}
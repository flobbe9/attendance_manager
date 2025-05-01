import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteDatabase } from "expo-sqlite";
import AbstractEntity from "./AbstractEntity_Schema";
import { eq, SQL } from "drizzle-orm/sql";
import { logError } from "@/utils/logUtils";


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


    async insert(values: Entity): Promise<Entity[] | null> {

        values.created = new Date();
        values.updated = new Date();

        try {
            return this.db.insert(this.table).values(values).returning() as any as Entity[];
            
        } catch (e) {
            logError(e.message);
            return null;
        }
    }
    

    /**
     * Update all entities matching `whereClause`.
     * 
     * @param values to insert. Object may be incomplete, will only update what's given
     * @param whereClause to identify the row(s) to update. If not specified, `values.id` is used as `whereClause` 
     * @returns the updated entities or `null` if error
     * @throws if sql error or no valid `whereClause` could be resolved
     */
    async update(values: Entity, whereClause?: SQL): Promise<Entity[] | null> {

        values.updated = new Date();
        
        try {
            if (!whereClause) {
                if (!values.id)
                    throw new Error(`Cannot update table. Missing both 'whereClause' and 'values.id'.`);

                whereClause = eq(this.table.id, values.id); 
            }

            return this.db
                .update(this.table)
                .set(values)
                .where(whereClause)
                .returning() as any as Entity[];

        } catch (e) {
            logError(e.message);
            return null;
        }
    }


    async select(where: SQL): Promise<Entity[] | null> {

        try {
            return this.db.select().from(this.table).where(where);

        } catch (e) {
            logError(e.message);
            return null;
        }
    }


    async delete(where: SQL) {

        try {
            return this.db.delete(this.table).where(where);

        } catch (e) {
            logError(e.message);
            return null;
        }
    }
}
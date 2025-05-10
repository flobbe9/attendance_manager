import { log, logError, logTrace } from "@/utils/logUtils";
import { eq, SQL } from "drizzle-orm/sql";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import AbstractEntity from "./Abstract_Schema";
import { Db } from "./Db";
import { assertFalsyAndThrow } from "@/utils/utils";


/**
 * Basically an equivalent of calling ```drizzle()``` with slight modifications.
 * 
 * Use this for any database actions instead of calling ```drizzle()```.
 * 
 * Use ```useDao()``` hook to instantiate this.
 * 
 * @since 0.0.1
 */
export class Dao<E extends AbstractEntity> {

    protected db: Db;
    protected table : SQLiteTableWithColumns<any>;


    constructor(db: Db, table: SQLiteTableWithColumns<any>) {

        this.db = db;
        this.table = table;
    }


    async insert(values: E): Promise<E | null> {

        try {
            values.created = new Date();
            values.updated = new Date();

            const results = await this.db.insert(this.table).values(values).returning() as any as E[];

            if (results.length) {

                const result = results[0];
                result.created = values.created;
                result.updated = values.updated;

                return result;
            }

            throw new Error(`Failed to insert into ${values.constructor.name}. Empty result set.`);
            
        } catch (e) {
            logError(e.message);
            return null;
        }
    }
    

    /**
     * Update all entities matching `where`.
     * 
     * @param values to insert. Object may be incomplete, will only update what's given
     * @param where to identify the row(s) to update. If not specified, `values.id` is used as `where` 
     * @returns the updated entities or `null` if error
     * @throws if sql error or no valid `where` could be resolved
     */
    async update(values: E, where?: SQL): Promise<E[] | null> {

        try {
            values.updated = new Date();
        
            if (!where) {
                if (!values.id)
                    throw new Error(`Cannot update table ${values.constructor.name}. Missing both 'where' and 'values.id'.`);

                where = eq(this.table.id, values.id); 
            }

            return this.db
                .update(this.table)
                .set(values)
                .where(where)
                .returning() as any as E[];

        } catch (e) {
            logError(e.message);
            return null;
        }
    }


    /**
     * Attempt to update `values` first but insert them instead if neither `where` nor `values.id` exist in db.
     * 
     * @param values to update or insert
     * @param where matcher for update statement
     * @returns inserted / updated value(s) or `null` if error
     */
    async updateOrInsert(values: E, where?: SQL): Promise<E | E[] | null> {

        assertFalsyAndThrow(values);

        // case: no where, fallback to values.id
        if (!where && values.id)
            where = eq(this.table.id, values.id);

        // update if where has at least 1 result
        if (where) {
            const selectResults = await this.select(where);
            if (selectResults.length) {
                logTrace(" Update instead of insert")
                return this.update(values, where);
            }
        }

        logTrace("Insert instead of update");
        return this.insert(values);
    }


    /**
     * @param where if not specified, select all entities
     * @returns array of results, empty array if no matches, `null` if error
     */
    async select(where?: SQL): Promise<E[] | null> {

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


    /**
     * @param id of entity
     * @returns true if entity with `id` exists
     * @throws if `id` is falsy
     */
    async existsById(id?: number): Promise<boolean> {

        assertFalsyAndThrow(id);

        return this.exists(eq(this.table.id, id))
    }
    

    /**
     * @param where the select query
     * @returns true if select query returns at least 1 result
     * @throws if arg is falsy
     */
    async exists(where: SQL): Promise<boolean> {

        assertFalsyAndThrow(where);

        const results = await this.select(where);

        return !!results.length;
    }
}
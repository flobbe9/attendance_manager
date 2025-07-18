import {logError} from "@/utils/logUtils";
import {assertFalsyAndThrow} from "@/utils/utils";
import {getTableName} from "drizzle-orm";
import {eq, SQL} from "drizzle-orm/sql";
import {SQLiteTableWithColumns} from "drizzle-orm/sqlite-core";
import AbstractEntity from "./Abstract_Schema";
import {Db} from "./Db";

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
    protected table: SQLiteTableWithColumns<any>;

    constructor(db: Db, table: SQLiteTableWithColumns<any>) {
        this.db = db;
        this.table = table;
    }

    /**
     * Will attempt to insert (but never update) `values`.
     *
     * @param values to insert
     * @returns saved result or `null` if error
     */
    public async insert<T extends E | E[]>(values: T): Promise<T | null> {
        try {
            if (!values)
                throw new Error(
                    `Failed to insert into table '${this.getTableName()}'. 'values' cannot be '${values}'`
                );

            const prepareValue = (value: E) => {
                value.created = new Date();
                value.updated = new Date();
            };

            if (Array.isArray(values)) values.forEach((value) => prepareValue(value));
            else prepareValue(values as E);

            return (await this.db.insert(this.table).values(values).returning()) as T;
        } catch (e) {
            logError(e.message);
            return null;
        }
    }

    /**
     * Update all entities matching `where`.
     *
     * Notice that setting a field value to `undefined` or removing it completely from the entity will not
     * be considered as setting the value to `null`. Instead the value wont be modified at all.
     *
     * @param values to insert. Object may be incomplete, will only update what's given
     * @param where to identify the row(s) to update. If not specified, `values.id` is used as `where`
     * @returns the updated entities or `null` if error
     * @throws if sql error or no valid `where` could be resolved
     */
    public async update(values: E, where?: SQL): Promise<E[] | null> {
        try {
            values.updated = new Date();

            if (!where) {
                if (!values.id)
                    throw new Error(
                        `Cannot update table ${getTableName(
                            this.table
                        )}. Missing both 'where' and 'values.id'.`
                    );

                where = eq(this.table.id, values.id);
            }

            return this.db.update(this.table).set(values).where(where).returning() as any as E[];
        } catch (e) {
            logError(e.message);
            return null;
        }
    }

    /**
     * Attempt to update `values` first but insert them instead if neither `where` nor `values.id` exist in db.
     *
     * @param values to update or insert. 
     * @param where matcher for update statement
     * @returns inserted / updated value(s) or `null` if error
     * @throws if `values` is an array AND `where` is specified because update does not work with multiple values
     */
    public async updateOrInsert(values: E | E[], where?: SQL): Promise<E | E[] | null> {
        assertFalsyAndThrow(values);

        if (Array.isArray(values) && where)
            throw new Error(
                `Failed to update or insert. Cannot update multiple using multiple values. Either specify only one 'values' object or don't specify 'where' arg`
            );

        // case: no where, fallback to values.id
        if (!Array.isArray(values) && !where && values.id) where = eq(this.table.id, values.id);

        // update if where has at least 1 result
        if (where) {
            const selectResults = await this.select(where);
            if (selectResults.length) return this.update(values as E, where);
        }

        return this.insert(values);
    }

    /**
     * @param where if not specified, select all entities
     * @returns array of results, empty array if no matches, `null` if error
     */
    public async select(where?: SQL): Promise<E[] | null> {
        try {
            return this.db.select().from(this.table).where(where);
        } catch (e) {
            logError(e.message);
            return null;
        }
    }

    public async delete(where: SQL) {
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
    public async existsById(id?: number): Promise<boolean> {
        assertFalsyAndThrow(id);

        return this.exists(eq(this.table.id, id));
    }

    /**
     * @param where the select query
     * @returns true if select query returns at least 1 result
     * @throws if arg is falsy
     */
    public async exists(where: SQL): Promise<boolean> {
        assertFalsyAndThrow(where);

        const results = await this.select(where);

        return !!results.length;
    }

    public getTableName(): string {
        return getTableName(this.table);
    }

    public async count(where?: SQL): Promise<number | null> {
        try {
            return await this.db.$count(this.table, where);
        } catch (e) {
            logError(e.message);
            return null;
        }
    }
}

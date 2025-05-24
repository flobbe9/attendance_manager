import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import AbstractEntity from "./Abstract_Schema";


/**
 * @since 0.0.1
 */
export abstract class AbstractService<T extends AbstractEntity> {

    /**
     * Should compare all class fields to determine whether an entity has been modified
     * 
     * @param entityLastSaved
     * @param entityModified
     * @return `true` if at least one class field is different
     */
    public abstract isModified(entityLastSaved: T, entityModified: T): boolean;
}
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import AbstractEntity from "./Abstract_Schema";


/**
 * @since 0.0.1
 */
export abstract class AbstractService<T extends AbstractEntity> {

    /**
     * Make sure to only use non-optional fields.
     * 
     * @param entity to check for it's type
     * @return true (infer the type) if `entity` is of type T
     */
    abstract isTypeOfEntity(entity: AbstractEntity): entity is T;
}
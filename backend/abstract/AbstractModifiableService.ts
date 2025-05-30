import AbstractEntity from "./Abstract_Schema";
import { AbstractService } from "./AbstractService";


/**
 * Extend your service class with this if the entity is an attendance input value.
 * 
 * @since latest
 */
export abstract class AbstractModifiableService<T extends AbstractEntity> extends AbstractService<T> {

    /**
     * Should compare all class fields to determine whether an entity has been modified
     * 
     * @param entityLastSaved
     * @param entityModified
     * @return `true` if at least one class field is different
     */
    public abstract isModified(entityLastSaved: T, entityModified: T): boolean;
}
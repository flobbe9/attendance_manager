import { defaultEqualsFalsy } from "@/utils/projectUtils";
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


    /**
     * @param entitiesLastSaved 
     * @param entitiesModified 
     * @returns true if only one list is falsy or the `length`s don't match or the order has changed or at least one entity {@link isModified} 
     * compared to the entity at the same index of the other array
     */
    public areModified(entitiesLastSaved: T[], entitiesModified: T[]): boolean {

        if (!defaultEqualsFalsy(entitiesLastSaved, entitiesModified))
            return false;
        
        if (entitiesLastSaved.length !== entitiesModified.length)
            return true;

        return !!entitiesLastSaved
            .find((entityLastSaved, i) => this.isModified(entityLastSaved, entitiesModified[i]));
    }
}
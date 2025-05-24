import { AbstractService } from "../abstract/AbstractService";
import { ExaminantEntity } from "../DbSchema";


/**
 * @since 0.0.1
 */
export class ExaminantService extends AbstractService<ExaminantEntity> {

    // TODO: test this
    public isModified(entityLastSaved: ExaminantEntity, entityModified: ExaminantEntity): boolean {

        if (!entityLastSaved)
            return !!entityModified;

        if (!entityModified)
            return true;

        return entityLastSaved.id !== entityModified.id || 
            entityLastSaved.role !== entityModified.role ||
            entityLastSaved.fullName !== entityModified.fullName ||
            entityLastSaved.attendanceId !== entityModified.attendanceId;
    }
    


    /**
     * @param entitiesLastSaved 
     * @param entitiesModified 
     * @returns true if only one list is falsy or the `length`s don't match or the order has changed or at least one entity {@link isModified} 
     * compared to the entity at the same index of the other array
     */
    // TODO: test this
    public areModified(entitiesLastSaved: ExaminantEntity[], entitiesModified: ExaminantEntity[]): boolean {

        if (!entitiesLastSaved)
            return !!entitiesModified;

        if (!entitiesModified)
            return true;

        if (entitiesLastSaved.length !== entitiesModified.length)
            return true;

        // find at least one modified
        return !!entitiesLastSaved
            .find((entityLastSaved, i) => this.isModified(entityLastSaved, entitiesModified[i]));
    }
}
import { ExaminantRole_Key, examinantRoleKeysObject } from "@/abstract/Examinant";
import { schoolSubjectKeysObj } from "@/abstract/SchoolSubject";
import { AbstractService } from "../abstract/AbstractService";
import { ExaminantEntity } from "../DbSchema";
import { AbstractModifiableService } from "../abstract/AbstractModifiableService";


/**
 * @since 0.0.1
 */
export class ExaminantService extends AbstractModifiableService<ExaminantEntity> {

    public isModified(entityLastSaved: ExaminantEntity, entityModified: ExaminantEntity): boolean {

        if (!entityLastSaved)
            return !!entityModified;

        if (!entityModified)
            return true;

        return entityLastSaved.role !== entityModified.role ||
            entityLastSaved.fullName !== entityModified.fullName ||
            entityLastSaved.attendanceId !== entityModified.attendanceId;
    }
    

    /**
     * @param entitiesLastSaved 
     * @param entitiesModified 
     * @returns true if only one list is falsy or the `length`s don't match or the order has changed or at least one entity {@link isModified} 
     * compared to the entity at the same index of the other array
     */
    public areModified(entitiesLastSaved: ExaminantEntity[], entitiesModified: ExaminantEntity[]): boolean {

        if (!entitiesLastSaved)
            return !!entitiesModified;

        if (!entitiesModified)
            return true;

        if (entitiesLastSaved.length !== entitiesModified.length)
            return true;

        const entitiesLastSavedSorted = this.sortByRole(entitiesLastSaved);
        const entitiesModifiedSorted = this.sortByRole(entitiesModified);

        return !!entitiesLastSavedSorted
            .find((entityLastSaved, i) => this.isModified(entityLastSaved, entitiesModifiedSorted[i]));
    }


    /**
     * See {@link ExaminantRole_Key} and {@link SchoolSubject_Key} for expected sort order.
     * 
     * @param examinantEntities to sort
     * @returns sorted (unmodified) `examinantEntities` or an empty array
     */
    public sortByRole(examinantEntities: ExaminantEntity[]): ExaminantEntity[] {

        if (!examinantEntities)
            return [];

        return [...examinantEntities]
            .sort((examinant1, examinant2) => {
                const examinant1Index = this.getExaminantSortIndexByRole(examinant1.role);
                const examinant2Index = this.getExaminantSortIndexByRole(examinant2.role);

                return examinant1Index - examinant2Index;
            })
    }


    private getExaminantSortIndexByRole(role: ExaminantRole_Key): number {

        return schoolSubjectKeysObj[role] ?? examinantRoleKeysObject[role] ?? -1;
    }
}
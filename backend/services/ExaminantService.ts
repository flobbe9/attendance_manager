import {ExaminantRole_Key, examinantRoleKeysObject} from "@/abstract/Examinant";
import {assertFalsyAndThrow} from "@/utils/utils";
import {AbstractModifiableService} from "../abstract/AbstractModifiableService";
import {ExaminantEntity} from "../entities/ExaminantEntity";

/**
 * @since 0.0.1
 */
export class ExaminantService extends AbstractModifiableService<ExaminantEntity> {
    public isModified(entityLastSaved: ExaminantEntity, entityModified: ExaminantEntity): boolean {
        if (!entityLastSaved) return !!entityModified;

        if (!entityModified) return true;

        return (
            entityLastSaved.role !== entityModified.role ||
            entityLastSaved.fullName !== entityModified.fullName ||
            entityLastSaved.attendanceId !== entityModified.attendanceId
        );
    }

    /**
     * @param entitiesLastSaved
     * @param entitiesModified
     * @returns true if only one list is falsy or the `length`s don't match or at least one entity {@link isModified}
     * compared to the entity at the same index of the other array
     */
    public areModified(
        entitiesLastSaved: ExaminantEntity[],
        entitiesModified: ExaminantEntity[]
    ): boolean {
        if (!entitiesLastSaved) return !!entitiesModified;

        if (!entitiesModified) return true;

        if (entitiesLastSaved.length !== entitiesModified.length) return true;

        const entitiesLastSavedSorted = this.sortByRole(entitiesLastSaved);
        const entitiesModifiedSorted = this.sortByRole(entitiesModified);

        return !!entitiesLastSavedSorted.find((entityLastSaved, i) =>
            this.isModified(entityLastSaved, entitiesModifiedSorted[i])
        );
    }

    /**
     * See {@link ExaminantRole_Key} and {@link SchoolSubject_Key} for expected sort order.
     *
     * @param examinantEntities to sort
     * @returns sorted (unmodified) `examinantEntities` or an empty array
     */
    public sortByRole(examinantEntities: ExaminantEntity[]): ExaminantEntity[] {
        if (!examinantEntities) return [];

        return [...examinantEntities].sort((examinant1, examinant2) => {
            const examinant1Index = this.getExaminantSortIndexByRole(examinant1.role);
            const examinant2Index = this.getExaminantSortIndexByRole(examinant2.role);

            return examinant1Index - examinant2Index;
        });
    }

    private getExaminantSortIndexByRole(role: ExaminantRole_Key): number {
        const examinantRoleKeyValue = examinantRoleKeysObject[role];
        return examinantRoleKeyValue ? examinantRoleKeyValue.index : -1;
    }

    /**
     * @param examinantEntities to get examinant from
     * @param examinantRole of the searched examinant
     * @returns `[examinant, examinantIndex]` of first ocurrence with `role` or `[null, -1]`
     * @throws if `examinantEntities` is falsy
     */
    public findExaminant(
        examinantEntities: ExaminantEntity[],
        examinantRole: ExaminantRole_Key
    ): [ExaminantEntity, number] {
        assertFalsyAndThrow(examinantEntities);

        let examinantIndex = -1;
        const examinant = examinantEntities.find((examinant, i) => {
            if (examinant.role === examinantRole) {
                examinantIndex = i;
                return true;
            }

            return false;
        });

        return examinant ? [examinant, examinantIndex] : [null, -1];
    }
}

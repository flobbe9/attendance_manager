import AbstractEntity from "./Abstract_Schema"
import { AbstractRepository } from "./AbstractRepository"
import { Cascade } from "./Cascade"
import { EntityRelationType } from "./EntityRelationType"
import { FetchType } from "./FetchType"
import { RelatedEntity } from "./RelatedEntity"


/**
 * Contains detail about a related entity.
 * 
 * @since 0.0.1
 */
export interface RelatedEntityDetail<ParentEntity extends AbstractEntity, E extends AbstractEntity> {

    repository: AbstractRepository<E>,
    column: {
        name: keyof ParentEntity,
        value: RelatedEntity<ParentEntity, E> | undefined
    },
    /** From the parent entity's perspective */
    relationType: EntityRelationType,
    /** List of cascade behaiviours to apply when calling a "cascade" method on parent */
    cascade?: Set<Cascade>,
    /** Indicates to delete this entity, should it be removed from one of it's owner's one-to-many list during a persist action. Default should be `false` */
    orphanRemoval?: boolean,
    /** Default is `EAGER` */
    fetchType?: FetchType
}


/**
 * Use this to retrieve the fetchType if possibly falsy to ensure to get the right default (`EAGER`).
 *  
 * @param fetchType to interpret
 * @returns `fetchType` or FetchType.EAGER
 */
export function getFetchType(fetchType?: FetchType): FetchType {

    return fetchType ?? FetchType.EAGER;
}
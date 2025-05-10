import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core"
import AbstractEntity from "./Abstract_Schema"
import { AbstractRepository } from "./AbstractRepository"
import { RelatedEntity, RelatedEntitySingle } from "./RelatedEntity"
import { Cascade } from "./Cascade"
import { FetchType } from "./FetchType"


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
    /** List of cascade behaiviours to apply when calling a "cascade" method on parent */
    cascade?: Set<Cascade>,
    /** Indicates to delete this entity, should it be removed from one of it's owner's one-to-many list during a persist action. */
    orphanRemoval?: boolean,
    /** Default is `EAGER` */
    fetchType?: FetchType
}
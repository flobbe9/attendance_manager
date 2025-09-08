import AbstractEntity from "@/backend/abstract/AbstractEntity";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";

/**
 * A value of any entity (ParentEntity) which is an entity or entity array itself.
 *
 * @type `ParentEntity` the type of the owning entity
 * @type `E` the type of the related entity
 * @since 0.0.1
 */
export type RelatedEntity<ParentEntity extends AbstractEntity, E extends AbstractEntity> = (E | E[]) & ValueOf<ParentEntity>;

/**
 * A value of any entity (ParentEntity) which is an entity itself and definitively on the "one" side of the relation
 * (not a collection that is).
 *
 * @type `ParentEntity` the type of the owning entity
 * @type `E` the type of the related entity
 * @since 0.0.1
 */
export type RelatedEntitySingle<ParentEntity extends AbstractEntity, E extends AbstractEntity> = E & ValueOf<ParentEntity>;

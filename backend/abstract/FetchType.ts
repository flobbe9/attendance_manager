/**
 * Describes the sql join mode for an abstract entity.
 * 
 * @since 0.0.1
 */
export enum FetchType {
    /** Join this entity's parent when calling `selectCascade` */
    EAGER,
    /** Don't join this entity's parent when calling `selectCascade` */
    LAZY
}
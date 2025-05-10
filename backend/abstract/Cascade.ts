/**
 * Define how a related entity should behave on db actions of it's parent entity.
 * 
 * NOTE: in order to use DELETE cascade, configure the entity schema using drizzles `references()` function.
 * 
 * @since 0.0.1
 */
export enum Cascade {

    INSERT,
    UPDATE
}
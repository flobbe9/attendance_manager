/**
 * Dont add class methods as entities are rarely instantiated by constructor.
 *
 * @since 0.0.1
 */
export default abstract class AbstractEntity {
    id?: number;

    created?: Date;

    updated?: Date;
}

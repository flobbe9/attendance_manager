/**
 * @since 0.2.4
 */
export abstract class FilterWrapper<T> {
    filterValue: any;

    constructor(filterValue: any) {
        this.filterValue = filterValue;
    }

    abstract filter(obj: T): boolean;
}

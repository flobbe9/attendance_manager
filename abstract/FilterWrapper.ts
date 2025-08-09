/**
 * @since latest
 */
export abstract class FilterWrapper<T> {
    filterValue: any;

    constructor(filterValue: any) {
        this.filterValue = filterValue;
    }

    abstract filter(obj: T): boolean;
}
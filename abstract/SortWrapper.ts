import { SortOrder } from "./SortOrder";

/**
 * @since latest
 */
export interface SortWrapper<T> {
    sortOrder: SortOrder;
    compare: (obj1: T, obj2: T, sortOrder: SortOrder) => number;
}
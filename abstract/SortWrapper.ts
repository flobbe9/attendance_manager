import { SortOrder } from "./SortOrder";

/**
 * @since 0.2.4
 */
export interface SortWrapper<T> {
    sortOrder: SortOrder;
    compare: (obj1: T, obj2: T, sortOrder: SortOrder) => number;
}

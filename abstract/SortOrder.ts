/**
 * @since latest
 */
export enum SortOrder {
    ASC,
    DESC
}

export function getOppositeSortOrder(sortOrder: SortOrder): SortOrder {
    return sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
}
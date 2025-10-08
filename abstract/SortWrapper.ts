import { SortOrder } from "./SortOrder";

/**
 * @since 0.2.4
 */
export interface SortWrapper {
    sortOrder: SortOrder;
    /** Whether to sort or not */
    enabled: boolean;
}

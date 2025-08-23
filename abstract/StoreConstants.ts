import { Platform } from "react-native";
import { PartialRecord } from "@/abstract/PartialRecord";

interface StoreConstantValue {
    /** Redirects to the store app on the device */
    storeAppUrl: string;
    /** Redirects to the store page in device's browser */
    storeBrowserUrl: string;
}

/**
 * @since 0.2.4
 * @see constants.ts `STORE_CONSTANTS`
 */
export interface StoreConstants extends PartialRecord<typeof Platform.OS, StoreConstantValue> {}

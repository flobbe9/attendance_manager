// import { AbstractStorage } from "@/abstract/AbstractStorage";
// import * as ExpoSecureStore from "expo-secure-store";
// import { SECURE_STORAGE_KEY_REGEX, SECURE_STORAGE_MAX_VALUE_LENGTH } from "./constants";
// import { logDebug } from "./logUtils";
// import { matchesAll } from "./utils";

// /**
//  * Persists across app launches. Use for sensitive data
//  * 
//  * @since latest
//  * @see https://docs.expo.dev/versions/latest/sdk/securestore/
//  */
// export class AsyncStorageImpl extends AbstractStorage<ExpoSecureStore.SecureStoreOptions> {

//     protected isKeyValid(key: string): boolean {
//         // case: key malformed
//         if (!matchesAll(key, SECURE_STORAGE_KEY_REGEX)) {
//             logDebug(`Failed to save value to secure storage. 'key' '${key}' is malformed. See 'SECURE_STORAGE_KEY_REGEX'`);
//             return false;
//         }

//         return true;
//     }

//     protected isValueValid(value: string): boolean {
//         // case: value too long
//         if (value.length > SECURE_STORAGE_MAX_VALUE_LENGTH) {
//             logDebug(
//                 `Failed to save value to secure storage. 'value' is too long (${value.length}). See 'SECURE_STORAGE_MAX_VALUE_LENGTH'`
//             );
//             return false;
//         }

//         return true;
//     }

//     protected getImpl(key: string, options?: ExpoSecureStore.SecureStoreOptions): Promise<string | null> {
//         return ExpoSecureStore.getItemAsync(key, options);
//     }

//     protected setImpl(key: string, value: string, options?: ExpoSecureStore.SecureStoreOptions): Promise<void> {
//         return ExpoSecureStore.setItemAsync(key, value, options);
//     }

//     protected deleteImpl(key: string, options?: ExpoSecureStore.SecureStoreOptions): Promise<void> {
//         return ExpoSecureStore.deleteItemAsync(key, options);
//     }
// }
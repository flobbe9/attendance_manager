import * as ExpoSecureStore from "expo-secure-store";
import {SECURE_STORAGE_KEY_REGEX, SECURE_STORAGE_MAX_VALUE_LENGTH} from "./constants";
import {logDebug, logError} from "./logUtils";
import {encodeBase64ToObj, encodeObjToBase64} from "./projectUtils";
import {isAnyFalsy, isBlank, matchesAll} from "./utils";

/**
 * Like localStorage but encrypted. 
 * 
 * Not persistent after uninstalling the app. 
 * 
 * Be careful with authentication requirements, see docs.
 *  
 * @since latest
 * @see https://docs.expo.dev/versions/latest/sdk/securestore/
 */
export class SecureStorage {
    private constructor() {
        // use static methods only
    }

    /**
     * @param key for storage value. See {@link SECURE_STORAGE_KEY_REGEX}
     * @param parseBase64 whether to expect value to be base64 encoded and a json string. Will return an object if `true`. Default is `false`
     * @param options to pass to secure store get method. See {@link ExpoSecureStore.SecureStoreOptions}
     * @returns resolved promise with either the string value, an object or null if an error occurred or no value with
     * `key` exists
     */
    static async get(
        key: string,
        parseBase64 = false,
        options?: ExpoSecureStore.SecureStoreOptions
    ): Promise<object | string | null> {
        if (isBlank(key)) {
            logDebug(`Failed to get value from secure storage. 'key' cannot be blank.`);
            return null;
        }

        let value = await ExpoSecureStore.getItemAsync(key, options);

        if (isAnyFalsy(value)) {
            logDebug(`Failed to get value from secure storage. No value with key '${key}'.`);
            return null;
        }

        if (parseBase64) {
            value = encodeBase64ToObj(value);

            if (value === null) {
                logError(`Failed to get value from secure storage for key '${key}'.`);
                return null;
            }
        }

        return value;
    }

    /**
     * @param key for storage value. See {@link SECURE_STORAGE_KEY_REGEX}
     * @param value to store. See {@link SECURE_STORAGE_KEY_REGEX}. Will be base64 encoded if is an object.
     * @param options to pass to secure store get method. See {@link ExpoSecureStore.SecureStoreOptions}
     */
    static async set(
        key: string,
        value: string | object,
        options?: ExpoSecureStore.SecureStoreOptions
    ): Promise<void> {
        if (isBlank(key)) {
            logDebug(`Failed to save value to secure storage. 'key' cannot be blank.`);
            return;
        }

        // case: key malformed
        if (!matchesAll(key, SECURE_STORAGE_KEY_REGEX)) {
            logDebug(
                `Failed to save value to secure storage. 'key' '${key}' is malformed. See 'SECURE_STORAGE_KEY_REGEX'`
            );
            return;
        }

        if (isAnyFalsy(value)) {
            logDebug(
                `Failed to save value to secure storage. 'value' cannot be falsy. 'key': ${key}.`
            );
            return;
        }

        if (typeof value === "object") {
            logDebug(value);
            value = encodeObjToBase64(value);
        }

        // case: value too long
        if (value.length > SECURE_STORAGE_MAX_VALUE_LENGTH) {
            logDebug(
                `Failed to save value to secure storage. 'value' for 'key' '${key}' is too long (${value.length}). See 'SECURE_STORAGE_MAX_VALUE_LENGTH'`
            );
            return;
        }

        await ExpoSecureStore.setItemAsync(key, value, options);
    }

    /**
     * @param key to delete entry for
     * @param options to pass to secure store get method. See {@link ExpoSecureStore.SecureStoreOptions}
     */
    static async delete(key: string, options?: ExpoSecureStore.SecureStoreOptions): Promise<void> {
        if (isBlank(key)) return;

        await ExpoSecureStore.deleteItemAsync(key, options);
    }
}

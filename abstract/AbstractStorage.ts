import { SECURE_STORAGE_KEY_REGEX } from "../utils/constants";
import { logDebug, logError } from "../utils/logUtils";
import { encodeBase64ToObj, encodeObjToBase64 } from "../utils/projectUtils";
import { isBlank, isFalsy } from "../utils/utils";

/**
 * Abstract storage definition for better debugging and optimized for storing objects.
 * 
 * @since latest
 */
export abstract class AbstractStorage<OptionsType> { // generic optionstype
    /**
     * Plain `get` call of storge implementation, do nothing else in here.
     * 
     * @param key 
     * @param options 
     */
    protected abstract getImpl(key: string, options?: OptionsType): Promise<string | null>;

    /**
     * Plain `set` call of storge implementation, do nothing else in here.
     * @param key 
     * @param value 
     * @param options 
     */
    protected abstract setImpl(key: string, value: string, options?: OptionsType): Promise<void>;

    /**
     * Plain `delete` call of storge implementation, do nothing else in here.
     * @param key 
     * @param options 
     */
    protected abstract deleteImpl(key: string, options?: OptionsType): Promise<void>;

    /**
     * Additional validation methods for storage key called before storing an entry. No need to include false and blank checks, those are done
     * by default methods.
     * 
     * Add some debug logs if invalid.
     * 
     * @param key storage key 
     */
    protected abstract isKeyValid(key: string): boolean;

    /**
     * Additional validation for storage value called before storing an entry. No need to include false and blank checks, those are done
     * by default methods.
     * 
     * Add some debug logs if invalid.
     * 
     * @param value storage value (either the original string or base64 encoded)
     */
    protected abstract isValueValid(value: string): boolean;

    /**
     * @param key for storage value. See {@link SECURE_STORAGE_KEY_REGEX}
     * @param parseBase64 whether to expect value to be base64 encoded and a json string. Will return an object if `true`. Default is `false`
     * @param options to pass to secure store get method. See {@link ExpoSecureStore.SecureStoreOptions}
     * @returns resolved promise with either the string value, an object or null if an error occurred or no value with
     * `key` exists
     */
    async get(key: string, parseBase64 = false, options?: OptionsType): Promise<object | string | null> {
        if (isBlank(key)) {
            logDebug(`Failed to get value from secure storage. 'key' cannot be blank.`);
            return null;
        }

        let value = await this.getImpl(key, options);

        if (isFalsy(value)) {
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
     * @param options to pass to secure store get method
     */
    async set(key: string, value: string | object, options?: OptionsType): Promise<void> {
        if (isBlank(key)) {
            logDebug(`Failed to save value to secure storage. 'key' cannot be blank.`);
            return;
        }
        
        if (!this.isKeyValid(key))
            return null;

        if (isFalsy(value)) {
            logDebug(`Failed to save value to secure storage. 'value' cannot be falsy. 'key': ${key}.`);
            return;
        }

        if (typeof value === "object") {
            logDebug(value);
            value = encodeObjToBase64(value);
        }
                
        if (!this.isValueValid(value))
            return null;

        await this.setImpl(key, value, options);
    }

    /**
     * @param key to delete entry for
     * @param options to pass to secure store get method. See {@link ExpoSecureStore.SecureStoreOptions}
     */
    async delete(key: string, options?: OptionsType): Promise<void> {
        if (isBlank(key)) return;

        await this.deleteImpl(key, options);
    }
}

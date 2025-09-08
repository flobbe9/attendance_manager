import { Linking, Platform } from "react-native";
import { appJson, STORE_CONSTANTS } from "./constants";
import { logDebug, logError, logTrace } from "./logUtils";
import { assertFalsyAndThrow, isBlank, isFalsy } from "./utils";
import { checkVersion, CheckVersionResponse } from "react-native-check-version";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { DocumentPickerAsset, DocumentPickerOptions, getDocumentAsync } from "expo-document-picker";

export function formatDateGermanNoTime(date: Date): string {
    if (!date) return "-";

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function formatDateGermanIncludeTime(date: Date): string {
    if (!date) {
        return "-";
    }
    
    return `${formatDateGermanNoTime(date)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function parseNumOrThrow(numString: string): number {
    assertFalsyAndThrow(numString);

    const num = Number(numString);

    if (isNaN(num)) throw new Error(`Failed to encode number '${numString}'`);

    return num;
}

export function parseNumOrReturnNull(numString: string): number | null {
    const num = Number(numString);

    if (isNaN(num) || isFalsy(numString)) return null;

    return num;
}

/**
 * Use this to compare primitive values.
 *
 * @param val1
 * @param val2
 * @param considerDistintFalsyValues if `true` values are considered not equal if they have different falsy values, e.g. `null` and `undefined`. Default is `false`
 * @returns `val1 === val2` and by default considering 2 falsy values equal
 */
export function defaultEquals<T>(val1: T, val2: T, considerDistintFalsyValues = false): boolean {
    if (considerDistintFalsyValues) return val1 === val2;

    if (!val1) return !val2;

    if (!val2) return false;

    return val1 === val2;
}

/**
 * @param val1
 * @param val2
 * @param considerDistintFalsyValues if `true` values are considered not equal if they have different falsy values, e.g. `null` and `undefined`. Default is `false`
 * @returns `val1 === val2` but only if one of the values is falsy, else `null`
 */
export function defaultEqualsFalsy<T>(val1: T, val2: T, considerDistintFalsyValues = false): boolean | null {
    if (!val1 || !val2) return defaultEquals(val1, val2, considerDistintFalsyValues);

    return null;
}

export function encodeStringToBase64(rawStr: string): string {
    if (isBlank(rawStr)) {
        logDebug(`Failed to encode string to base64. 'rawStr' is ${rawStr}`);
        return null;
    }

    return Buffer.from(rawStr).toString("base64");
}

export function encodeBase64(base64: string): string {
    if (isBlank(base64)) {
        logDebug(`Failed to encode base64. 'base64' is ${base64}`);
        return null;
    }

    return Buffer.from(base64, "base64").toString();
}

/**
 * base64Str -> json string -> obj.
 *
 * @param base64Str
 * @returns
 */
export function encodeBase64ToObj(base64Str: string): any {
    if (isBlank(base64Str)) {
        logDebug(`Failed to encode base64 to obj. 'base64Str' is ${base64Str}`);
        return null;
    }

    return JSON.parse(encodeBase64(base64Str));
}

/**
 * obj -> json string -> base64.
 * @param obj
 * @returns
 */
export function encodeObjToBase64(obj: object): string | null {
    if (isFalsy(obj)) {
        logDebug(`Failed to encode json to base64. 'obj' is ${obj}`);
        return null;
    }

    return encodeStringToBase64(JSON.stringify(obj));
}

/**
 * Redirect to store app or browser page as fallback. Works for both android and ios.
 */
export async function redirectToStore(): Promise<void> {
    const { storeAppUrl, storeBrowserUrl } = STORE_CONSTANTS[Platform.OS];

    try {
        const supported = await Linking.canOpenURL(storeAppUrl);
        await Linking.openURL(supported ? storeAppUrl : storeBrowserUrl);
    } catch (error) {
        logError("Failed to redirect to store app.");
        await Linking.openURL(storeBrowserUrl);
    }
}

/**
 * Write `content` to file and open share popup on device. Enables user to store file on disk or share it via any supported method like whatsapp etc.
 * 
 * @param content cannot be falsy (but blank though)
 * @param fileName include the extension but not the path
 * @param mimeType e.g. 'text/plain' for .txt files. Will be overridden by `sharingOptions` if `sharingOptions.mimeType` is specified
 * @param writingOptions 
 * @param sharingOptions 
 * @see https://docs.expo.dev/versions/latest/sdk/sharing/
 */
export async function stringToFile(
    content: string,
    fileName: string,
    mimeType: string,
    writingOptions?: FileSystem.WritingOptions,
    sharingOptions?: Sharing.SharingOptions
): Promise<void> {
    assertFalsyAndThrow(0, fileName, mimeType);

    try {
        if (isFalsy(content))
            throw new Error(`Failed to write to file. 'content' is ${content}`);
    
        if (!(await Sharing.isAvailableAsync()))
            throw new Error("Sharing is not available");
    
        const fullFilePath = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fullFilePath, content, writingOptions);
    
        await Sharing.shareAsync(fullFilePath, {
            dialogTitle: "Speichern",
            mimeType,
            ...sharingOptions,
        });
    // catch and log because expo lib errors are not logged
    } catch (e) {
        logError(e.message);
        throw e;
    }
}

/**
 * Opens the devices file system and lets user pick a file. 
 * 
 * @param options includes `readContent`. If set to true the file contents will be read to string with `readOptions`:
 * 
 * `const content: string = await pickFile({readContent: true}).content`.
 * 
 * Default is `false`.
 * @param readOptions 
 * @returns file object (asset) containing all details of the picked file or `null` if promise is `canceled` or an error occurred
 * @see https://docs.expo.dev/versions/latest/sdk/document-picker
 */
export async function pickFile(options?: DocumentPickerOptions & { readContent?: boolean }, readOptions?: FileSystem.ReadingOptions): Promise<DocumentPickerAsset & {content?: string} | null> {
    try {
        const response = await getDocumentAsync(options);
        if (response.canceled) {
            logTrace("pick file was canceled");
            return null;
        }

        const asset = response.assets && response.assets.length ? response.assets[0] : null;

        if (options.readContent)
            Object.assign(asset, {content: await FileSystem.readAsStringAsync(asset.uri, readOptions)})

        return asset;

    } catch (e) {
        logError(e.message);
        return null;
    }
}
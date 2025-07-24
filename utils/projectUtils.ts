import { logDebug } from "./logUtils";
import { assertFalsyAndThrow, isBlank, isFalsy } from "./utils";

export function formatDateGermanNoTime(date: Date): string {
    if (!date) return "-";

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function parseNumOrThrow(numString: string): number {
    assertFalsyAndThrow(numString);

    const num = Number(numString);

    if (isNaN(num)) throw new Error(`Failed to encode number '${numString}'`);

    return num;
}

export function parseNumOrReturnNull(numString: string): number | null {
    const num = Number(numString);

    if (isNaN(num) || isFalsy(numString))
        return null; 

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
export function defaultEqualsFalsy<T>(
    val1: T,
    val2: T,
    considerDistintFalsyValues = false
): boolean | null {
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

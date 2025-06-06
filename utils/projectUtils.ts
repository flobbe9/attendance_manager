import { assertFalsyAndThrow } from "./utils";

export function formatDateGermanNoTime(date: Date): string {

    if (!date)
        return '-';

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}


export function parseNumOrThrow(numString: string): number {

    assertFalsyAndThrow(numString);

    const num = Number(numString);

    if (isNaN(num))
        throw new Error(`Failed to parse number '${numString}'`);

    return num;
}

export function parseNumOrReturnNull(numString: string): number | null {

    const num = Number(numString);

    if (isNaN(num))
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

    if (considerDistintFalsyValues)
        return val1 === val2;

    if (!val1)
        return !val2;

    if (!val2)
        return false;

    return val1 === val2;
}
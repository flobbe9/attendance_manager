import { logError } from "@/utils/logUtils";
import { isNumberFalsy, sleep } from "@/utils/utils";
import { DependencyList, useEffect, useState } from "react";
import { useHasComponentMounted } from "./useHasComponentMounted";


export interface FlashStateOptions {
    /** The time (in ms) to wait between every state change */
    interval: number,
    /** The number state change cycles. One cycle will change the state to both "on" and "off" */
    numFlashes: number,
    /** Indicates for the first flash to use `offValue` instead of `onValue`. Default is `false` */
    startReversed?: boolean,
    /** Indicates to flash on component mount if `deps` are specified and not empty. Default is `false` */
    flashOnRender?: boolean
}


/**
 * Repeatedly update given state using a certain interval. Trigger the flash either by using the returned `flash` function or by 
 * specifying deps.
 * 
 * @param offValue considered the initial value unless `options.startReversed` is `true`
 * @param onValue considered the value to "flash" to, unless `options.startReversed` is `false`
 * @param setValue state setter
 * @param options 
 * @param deps to trigger the flash Set to `null` in order to never flash on deps change or render. See also `options.flashOnRender`.
 * Use returned `flash` function instead. Default is `null`
 * @since 0.0.1
 */
export function useFlashState<T>(offValue: T, onValue: T, options: FlashStateOptions, deps: DependencyList | null = null) {

    const { interval, numFlashes, startReversed = false, flashOnRender = false } = options;
    
    const [currentValue, setCurrentValue] = useState<T>(startReversed ? onValue : offValue);

    const hasComponentMounted = useHasComponentMounted();

    
    useEffect(() => {
        if (!validateParamsAndOptionsAndLog() || deps === null)
            return;

        if (!flashOnRender && deps.length && !hasComponentMounted)
            return;

        flash();

    }, deps);


    async function flashOnce(value: T): Promise<void> {

        setCurrentValue(value);

        return sleep(interval);
    }


    async function flash(): Promise<void> {

        for (let i = 0; i < numFlashes; i++) {
            let firstValue: T = startReversed ? offValue : onValue;
            let secondValue: T = startReversed ? onValue: offValue;

            await flashOnce(firstValue);
            await flashOnce(secondValue);
        }
    }


    function validateParamsAndOptionsAndLog(): boolean {

        const errorMessageStart = "Failed to flash state.";

        if (isNumberFalsy(numFlashes)) {
            logError(`${errorMessageStart} Falsy option 'numFlashes': ${numFlashes}`)
            return false;
        } 

        if (isNumberFalsy(interval)) {
            logError(`${errorMessageStart} Falsy option 'interval': ${interval}`)
            return false;
        } 

        return true;
    }


    return {
        currentValue,
        setCurrentValue,
        flash,
        flashOnce
    };
}
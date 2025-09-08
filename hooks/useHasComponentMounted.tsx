import { useEffect, useState } from "react";


/**
 * Simply sets a state to true on first render and returns it.
 * 
 * @param delay to wait before setting "mounted" to true (in ms). Default is 0
 * @since 0.0.1
 */
export function useHasComponentMounted(delay = 0) {

    const [hasComponntMounted, setHasComponentMounted] = useState(false);


    useEffect(() => {
        setTimeout(() => {
            setHasComponentMounted(true);
        }, delay);
    }, []);

    return hasComponntMounted;
}
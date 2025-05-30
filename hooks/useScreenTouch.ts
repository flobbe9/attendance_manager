import { GlobalContext } from "@/components/context/GlobalContextProvider";
import { useContext, useEffect } from "react";


/**
 * Execute an action on screen touch. Depends on `globalScreenTouch` and this hook beeing used inside `GlobalContextProvider`.
 * 
 * @param callback to execute on screen touch
 * @since 0.0.1
 */
export function useScreenTouch(callback: () => void): void {

    const { globalScreenTouch } = useContext(GlobalContext);


    useEffect(() => {
        callback();
    }, [globalScreenTouch])
}
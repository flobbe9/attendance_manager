import { useEffect } from "react";
import { BackHandler } from "react-native";


/**
 * Adds back eventlistener.
 * 
 * @param callBack return ```true``` in order not to navigate, return ```false``` to "pop" the current screen
 * @param deps passed to useeffect as second arg
 * @since 0.0.1
 */
export function useBackHandler(callBack: () => boolean, deps?: React.DependencyList) {

    useEffect(() => {
        const eventSubscription = BackHandler.addEventListener("hardwareBackPress", callBack);

        return () => eventSubscription.remove();
    }, deps);
}
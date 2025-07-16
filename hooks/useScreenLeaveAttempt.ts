import {NavigationAction, usePreventRemove} from "@react-navigation/native";
import {useEffect} from "react";

/**
 * Handle screen leave attempt, successful or not.
 *
 * @param isDontLeaveScreen indicates whether the screen leave should be prevented or not.
 * @param options
 * `handleScreenLeave` only executed if `isDontLeaveScreen` is `true`
 *
 * `handleDontLeaveScreen` only executed if `isScreenLave` is `false`
 * @since 0.1.0
 */
export function useScreenLeaveAttempt(
    isDontLeaveScreen: boolean,
    options: {
        Focused?: boolean;
        handleScreenLeave?: () => void;
        handleDontLeaveScreen?: (options: DontLeaveScreenOptions) => void;
    }
): void {
    const {handleDontLeaveScreen, handleScreenLeave} = options;

    usePreventRemove(isDontLeaveScreen, handleDontLeaveScreen);

    useEffect(() => {
        return () => handleScreenLeave();
    }, []);
}

/**
 * @since 0.1.0
 */
export interface DontLeaveScreenOptions {
    data: {
        action: NavigationAction;
    };
}

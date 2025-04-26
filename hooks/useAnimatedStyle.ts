import { log } from "@/utils/logUtils";
import { TRANSITION_DURATION } from "@/utils/styleConstants";
import { DependencyList, useEffect, useState } from "react";
import { Animated, useAnimatedValue } from "react-native";
import { useHasComponentMounted } from "./useHasComponentMounted";


/**
 * @param inputRange determines how finegrained the animation will be, e.g. [0, 255]
 * @param outputRange the actual style value range, e.g. ["rgb(0, 0, 0)", "rgb(255, 255, 255)"]
 * @param reverse whether to animate in reverse when animationDeps change
 * @param animationDeps if specified, the animation will be triggered whenever the deps change (useEffect). Set to `null` in order
 * to disable animation triggered by state. Default is `[reverse]`
 * @param duration in ms. Default is {@link TRANI}
 * @since 0.0.1
 * @see Animated.Value.interpolate
 */
export function useAnimatedStyle(
    inputRange: number[],
    outputRange: string[] | number[],
    reverse?: boolean,
    animationDeps: DependencyList | null = [reverse],
    duration = TRANSITION_DURATION
) {

    const animatedValue = useAnimatedValue(inputRange.length ? inputRange[0] : 0);

    const hasMounted = useHasComponentMounted();

    useEffect(() => {
        if (animationDeps && hasMounted)
            animate(reverse);

    }, animationDeps);


    function animate(reverse = false): void {

        Animated.timing(
            animatedValue,
            {
                toValue: inputRange[reverse ? 0 : inputRange.length - 1],
                duration: duration,
                useNativeDriver: false
            }
        ).start();
    }


    function interpolate(): Animated.AnimatedInterpolation<string | number> {

        return animatedValue.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
    }


    return {
        animate,
        /** Pass this as component style. */
        animatedStyle: interpolate()
    }
}
import { TRANSITION_DURATION } from "@/utils/styleConstants";
import { DependencyList, useEffect } from "react";
import { Animated, Easing, EasingFunction, useAnimatedValue } from "react-native";
import { useHasComponentMounted } from "./useHasComponentMounted";


/**
 * @param inputRange determines how finegrained the animation will be, e.g. [0, 255]
 * @param outputRange the actual style value range, e.g. ["rgb(0, 0, 0)", "rgb(255, 255, 255)"]
 * @param options
 * 
 * `reverse` whether to animate in reverse when animationDeps change
 * 
 * `animationDeps` if specified, the animation will be triggered whenever the deps change (useEffect). Set to `null` in order
 * to disable animation triggered by state. Default is `[reverse]`
 * 
 * `duration` in ms. Default is {@link TRANSITION_DURATION}
 * 
 * `startReversed` indicates to use the `inputRange`'s last value as initial animated value. Default is `false`
 * 
 * `easing` see {@link Easing}. Default is "inOut"
 * 
 * `onComplete` called after animation is done
 * @since 0.0.1
 * @see Animated.Value.interpolate
 */
export function useAnimatedStyle(
    inputRange: number[],
    outputRange: string[] | number[],
    options: {
        reverse?: boolean,
        animationDeps?: DependencyList | null,
        duration?: number,
        startReversed?: boolean,
        easing?: EasingFunction,
        onComplete?: () => void
    } = {}
) {

    const { 
        duration = TRANSITION_DURATION, 
        easing = Easing.inOut(Easing.ease), 
        reverse, 
        animationDeps = [reverse], 
        startReversed = false 
    } = options;
    const animatedValue = useAnimatedValue(inputRange.length ? inputRange[startReversed ? inputRange.length - 1 : 0] : 0);

    const hasMounted = useHasComponentMounted();

    useEffect(() => {
        if (animationDeps && hasMounted) {
            animate(reverse);
            
            setTimeout(() => {
                if (options.onComplete)
                    options.onComplete();
            }, duration);
        }

    }, animationDeps);


    function animate(reverse = false): void {

        Animated.timing(
            animatedValue,
            {
                toValue: inputRange[reverse ? 0 : inputRange.length - 1],
                duration,
                easing,
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
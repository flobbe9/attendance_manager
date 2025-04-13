import { TRANSITION_DURATION } from "@/utils/styleConstants";
import { Animated } from "react-native";


/**
 * 
 * @param inputRange determines how finegrained the animation will be
 * @param outputRange the actual style value range
 * @param animatedValue the style value
 * @since 0.0.1
 * @see Animated.Value.interpolate
 */
export function useAnimatedStyles(
    inputRange: number[],
    outputRange: string[] | number[],
    animatedValue: Animated.Value
) {

    function animate(reverse = false, duration = TRANSITION_DURATION): void {

        Animated.timing(
            animatedValue,
            {
                toValue: inputRange[reverse ? 0 : inputRange.length - 1],
                duration: duration || TRANSITION_DURATION,
                useNativeDriver: false
            }
        ).start();
    }


    return {
        animate,
        animatedStyle: animatedValue.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        })
    }
}
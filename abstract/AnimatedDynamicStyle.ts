import { Animated } from "react-native";
import { DynamicStyle } from "./DynamicStyle";


/**
 * Pass this to ```useDynamicStyle``` or ```useDefaultProps``` in order to animate a certain styleProp using an event.
 * 
 * @since 0.0.1
 */
export interface AnimatedDynamicStyle<StyleType> {
    
    styleProp: keyof StyleType,
    animatedValue: Animated.AnimatedValue,
    inputRange: number[],
    event: keyof DynamicStyle<StyleType>,
    duration?: number
}
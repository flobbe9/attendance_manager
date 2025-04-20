import { Animated } from "react-native";
import { DynamicStyles } from "./DynamicStyles";


/**
 * Pass this to ```useDynamicStyles``` or ```useDefaultProps``` in order to animate a certain styleProp.
 * 
 * @since 0.0.1
 */
export interface AnimatedStyleProp<StyleType> {
    
    styleProp: keyof StyleType,
    animatedValue: Animated.AnimatedValue,
    inputRange: number[],
    event: keyof DynamicStyles<StyleType>,
    duration?: number
}
import { Animated } from "react-native";
import { DynamicStyles } from "./DynamicStyles";


/**
 * Pass this to ```useDynamicStyles``` or ```useDefaultProps``` in order to animate a certain styleProp.
 * 
 * @since 0.0.1
 */
export interface AnimatedStyleProp<StyleProp> {
    
    styleProp: keyof StyleProp,
    animatedValue: Animated.AnimatedValue,
    inputRange: number[],
    event: keyof DynamicStyles<StyleProp>,
    duration?: number
}

// EXAMPLE:
// export function getAnimatedBackgroundColorProp(animatedValue: Animated.Value): AnimatedStyleProp<ViewStyle> {

//     return {
//         styleProp: "backgroundColor",
//         animatedValue,
//         inputRange: [0, 255],
//         event: "focus",
//         duration: 100
//     }
// }
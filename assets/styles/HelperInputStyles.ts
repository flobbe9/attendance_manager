import { AnimatedStyleProp } from "@/abstract/AnimatedStyleProp";
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { Animated, TextStyle, ViewStyle } from "react-native";


export class HelperInputStyles {
    static component: DynamicStyles<TextStyle> = {
        default: {
            borderBottomWidth: 1,
            padding: GLOBAL_SCREEN_PADDING,
            
        }
    }

    /** For the outer ```<Animated.View>``` */
    static view: DynamicStyles<ViewStyle> = {
        default: {
            backgroundColor: "rgb(255, 255, 255)",
        },
        focus: {
            backgroundColor: "rgb(220, 220, 220)",
        }
    }
}


export function getAnimatedBackgroundColorProp(animatedValue: Animated.Value): AnimatedStyleProp<ViewStyle> {

    return {
        styleProp: "backgroundColor",
        animatedValue,
        inputRange: [0, 255],
        event: "focus",
        duration: 100
    }
}
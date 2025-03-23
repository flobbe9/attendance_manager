import { AnimatedStyleProp } from "@/abstract/AnimatedStyleProp";
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { Animated, TextStyle, ViewStyle } from "react-native";


type StyleType = TextStyle;


export class HelperTextInputStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            borderWidth: 1
        }
    }

    /** For the outer ```<Animated.View>``` */
    static view: DynamicStyles<ViewStyle> = {
        default: {
            backgroundColor: "rgb(255, 255, 255)",
        },
        focus: {
            backgroundColor: "rgb(220, 220, 220)",
        },
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
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class HelperInputStyles {
    static component: DynamicStyle<TextStyle> = {
        default: {
            borderWidth: 0,
            color: "black",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    /** For the outer ```<Animated.View>``` */
    static view: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: BORDER_RADIUS,
        },
        focus: {
            backgroundColor: "rgb(150, 150, 150)",
        },
        animatedDynamicStyles: {
            backgroundColor: (animatedValue) => ({
                styleProp: "backgroundColor",
                animatedValue,
                inputRange: [0, 255],
                event: "focus",
                duration: 100
            }),
        }
    }
}
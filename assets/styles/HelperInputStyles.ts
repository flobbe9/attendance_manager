import { DynamicStyle } from "@/abstract/DynamicStyle";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class HelperInputStyles {
    static component: DynamicStyle<TextStyle> = {
        default: {
            borderBottomWidth: 1,
            color: "black",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    /** For the outer ```<Animated.View>``` */
    static view: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "rgb(255, 255, 255)",
        },
        focus: {
            backgroundColor: "rgb(220, 220, 220)",
        },
        animatedDynamicStyles: {
            backgroundColor: (animatedValue) => ({
                styleProp: "backgroundColor",
                animatedValue,
                inputRange: [0, 255],
                event: "focus",
                duration: 100
            })
        }
    }
}
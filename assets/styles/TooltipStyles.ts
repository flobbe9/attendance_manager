import { DynamicStyle } from "@/abstract/DynamicStyle";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class TooltipStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            position: "relative",
            zIndex: 1,
        }
    }

    static iconButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "transparent",
            borderRadius: "100%",
        }
    }

    static textContainer: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "black",
            boxShadow: "2 0 5 gray",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    static text: DynamicStyle<TextStyle> = {
        default: {
            color: "white",
        }
    }
}
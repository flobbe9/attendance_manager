import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";

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
            boxShadow: "2 0 5 gray",
            position: "absolute",
        }
    }

    static text: DynamicStyle<TextStyle> = {
        default: {
            backgroundColor: "black",
            color: "white",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }
}
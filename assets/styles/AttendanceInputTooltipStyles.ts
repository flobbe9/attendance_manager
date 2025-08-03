import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class AttendanceInputTooltipStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    }

    static icon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
    }

    static button: ViewStyle = {
        backgroundColor: "transparent",
        borderRadius: "100%",
        // make button a square
        height: FONT_SIZE_LARGER + 20,
        width: FONT_SIZE_LARGER + 20,
    }

    static textContainerStyles: ViewStyle = {
        backgroundColor: "rgb(197, 197, 197)",
    }

    static maxWidthPortrait = 200;
    static maxWidthLandscape = 400;
}
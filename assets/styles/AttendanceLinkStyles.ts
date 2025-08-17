import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, BORDER_WIDTH, FONT_SIZE_LARGER, FONT_SIZE_SMALLER, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class AttendanceLinkStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS,
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE_LARGER
        }
    }


    static topic: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE_SMALLER
        }
    }

    static bottomRowElement: DynamicStyle<TextStyle> = {
        default: {
            color: "rgb(100, 100, 100)"
        }
    }

    static icon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
        marginStart: 5,
    }
}
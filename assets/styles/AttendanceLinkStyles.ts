import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, BORDER_WIDTH, FONT_SIZE_LARGER, FONT_SIZE_SMALLER, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


type StyleType = ViewStyle;


export class AttendanceLinkStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            borderWidth: 3,
            borderRadius: BORDER_RADIUS,
            marginBottom: GLOBAL_SCREEN_PADDING,
            padding: 5,
        }
    }

    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE_LARGER
        }
    }

    static subheading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE_SMALLER
        }
    }

    static icon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
        marginStart: 5,
    }
}
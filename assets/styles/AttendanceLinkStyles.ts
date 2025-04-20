import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


type StyleType = ViewStyle;


export class AttendanceLinkStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            borderWidth: 4,
            borderRadius: BORDER_RADIUS,
            padding: 5,
        }
    }

    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: 25
        }
    }

    static subheading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: 15
        }
    }

    static icon: TextStyle = {
        fontSize: 25,
        marginStart: 5,
    }
}
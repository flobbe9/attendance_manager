import { DynamicStyles } from "@/abstract/DynamicStyles";
import { BORDER_RADIUS } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


type StyleType = ViewStyle;


export class AttendanceLinkStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            borderWidth: 4,
            borderRadius: BORDER_RADIUS,
            padding: 5,
            width: "100%"
        }
    }

    static heading: DynamicStyles<TextStyle> = {
        default: {
            fontSize: 25
        }
    }

    static subheading: DynamicStyles<TextStyle> = {
        default: {
            fontSize: 15
        }
    }

    static icon: TextStyle = {
        fontSize: 25,
        marginStart: 5,
    }
}
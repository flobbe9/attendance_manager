import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";


type StyleType = ViewStyle;

const addButtonWidth = 60;
const addButtonPosition = 50;
const addButtonFontSize = 20;


export class AttendanceIndexStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            padding: GLOBAL_SCREEN_PADDING,
            minHeight: "100%"
        }
    }

    static link: DynamicStyle<StyleType> = {
        default: {
            marginBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static addButtonOuterView: DynamicStyle<StyleType> = {
        default: {
            bottom: 80,
            position: "absolute",
            right: addButtonPosition,
        }
    }
    
    static addButton: DynamicStyle<StyleType> = {
        default: {
            height: addButtonWidth,
            paddingStart: 20,
            paddingEnd: 20,
            width: addButtonWidth
        }
    }

    static addButtonLabel: DynamicStyle<TextStyle> = {
        default: {
            fontSize: addButtonFontSize
        }
    }

    static buttonIcon: TextStyle = {
        fontSize: addButtonFontSize,
        ...HS.fitContent
    }
}
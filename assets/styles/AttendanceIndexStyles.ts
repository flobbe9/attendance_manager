import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";


type StyleType = ViewStyle;

const addButtonWidth = 60;
const addButtonPosition = 20;


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
            bottom: addButtonPosition,
            position: "absolute",
            right: addButtonPosition,
        }
    }
    
    static addButton: DynamicStyle<StyleType> = {
        default: {
            borderRadius: "100%",
            height: addButtonWidth,
            width: addButtonWidth,
        }
    }

    static buttonIcon: TextStyle = {
        fontSize: 20,
        ...HS.fitContent
    }
}
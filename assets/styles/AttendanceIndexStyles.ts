import { DynamicStyles } from "@/abstract/DynamicStyles";
import { TextStyle, ViewStyle } from "react-native";
import { HelperStyles } from "./helperStyles";


type StyleType = ViewStyle;

const componentPadding = 10;

const addButtonWidth = 60;
const addButtonPosition = 20;


export class AttendanceIndexStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            padding: componentPadding,
            height: "100%"
        }
    }

    static link: DynamicStyles<StyleType> = {
        default: {
            marginBottom: componentPadding
        }
    }

    static addButtonOuterView: DynamicStyles<StyleType> = {
        default: {
            bottom: addButtonPosition,
            position: "absolute",
            right: addButtonPosition,
        }
    }
    
    static addButton: DynamicStyles<StyleType> = {
        default: {
            borderRadius: "100%",
            height: addButtonWidth,
            width: addButtonWidth,
        }
    }

    static buttonIcon: DynamicStyles<TextStyle> = {
        default: {
            fontSize: 20,
            ...HelperStyles.fitContent
        }
    }
}
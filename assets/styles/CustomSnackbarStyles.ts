import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, LIGHT_COLOR } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class CustomSnackbarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    }

    static label: TextStyle = {
        padding: 5,
    }

    // NOTE: make sure these are named exactly like CustomSnackbarStatus
    static error: ViewStyle = {
        backgroundColor: "rgb(255, 50, 0)"
    }
    static warn: ViewStyle = {
        backgroundColor: "rgb(255, 200, 0)"
    }
    static info: ViewStyle = {
        backgroundColor: LIGHT_COLOR
    }
    static success: ViewStyle = {
        backgroundColor: "rgb(50, 255, 50)"
    }
    static default: ViewStyle = {
        // only for completeness, shouldn't do anything
    }
}
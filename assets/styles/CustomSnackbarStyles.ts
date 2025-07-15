import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS } from "@/utils/styleConstants";
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
        backgroundColor: "rgb(230, 225, 229)" // light theme
    }
    static default: ViewStyle = {
        // only for completeness, shouldn't do anything
    }
}
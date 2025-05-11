import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class SnackbarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {

        }
    }

    static label: TextStyle = {
        borderColor: "black",
        borderRadius: BORDER_RADIUS,
        borderWidth: 2,
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
        ...this.component.default
    }
}
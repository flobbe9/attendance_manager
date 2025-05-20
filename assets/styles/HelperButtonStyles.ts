import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";
import HS from "./helperStyles";

type StyleType = ViewStyle;

const padding = 10;

export class HelperButtonStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            backgroundColor: "rgb(220, 220, 220)",
            padding: padding,
            ...HS.fitContent,
        }
    }

    static loadingIndicator: ViewStyle = {
        position: "absolute",
        right: padding
    }
}
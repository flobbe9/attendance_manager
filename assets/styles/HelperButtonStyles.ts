import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";
import HS from "./helperStyles";

type StyleType = ViewStyle;


export class HelperButtonStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            backgroundColor: "rgb(220, 220, 220)",
            padding: 10,
            ...HS.fitContent,
        }
    }
}
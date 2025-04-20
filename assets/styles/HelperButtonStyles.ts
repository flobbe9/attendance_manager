import { DynamicStyles } from "@/abstract/DynamicStyles";
import { ViewStyle } from "react-native";
import HS from "./helperStyles";

type StyleType = ViewStyle;


export class HelperButtonStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            backgroundColor: "rgb(220, 220, 220)",
            padding: 10,
            ...HS.fitContent,
        }
    }
}
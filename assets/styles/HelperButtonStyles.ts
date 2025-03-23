import { DynamicStyles } from "@/abstract/DynamicStyles";
import { ViewStyle } from "react-native";
import { HelperStyles } from "./helperStyles";

type StyleType = ViewStyle;


export class HelperButtonStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            backgroundColor: "#2196F3",
            // ...HelperStyles.fitContent,
            ...HelperStyles.flexCenter,
        },
        touchStart: {
            backgroundColor: "red"
        }
    }
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";

export class DatePickerStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fitContent
        },
    };
}

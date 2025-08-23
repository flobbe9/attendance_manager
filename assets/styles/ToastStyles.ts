import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";

export class ToastStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "white",
            borderRadius: BORDER_RADIUS,
            ...HelperStyles.flexStartStart,
            flexDirection: "column",
            maxHeight: "80%",
            maxWidth: "70%",
            minHeight: 100,
            minWidth: 100,
            margin: "auto",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    static childrenContainer: DynamicStyle<ViewStyle> = {
        default: {
            padding: 10,
            ...HelperStyles.fullWidth
        }
    }
}
import {DynamicStyle} from "@/abstract/DynamicStyle";
import {TextStyle, ViewStyle} from "react-native";
import HelperStyles from "./helperStyles";
import {BORDER_RADIUS, GLOBAL_SCREEN_PADDING} from "@/utils/styleConstants";

export class ToastDefaultFooterStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth,
        },
    };

    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS,
            borderWidth: 1
        },
    };

    static buttonChildren: DynamicStyle<TextStyle> = {
        default: {},
    };
}

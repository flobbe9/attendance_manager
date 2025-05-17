import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";


export class ToastDefaultFooterStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            bottom: GLOBAL_SCREEN_PADDING,
            position: "absolute",
            right: GLOBAL_SCREEN_PADDING,
        }
    }


    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS,
        }
    }

    
    static buttonChildren: DynamicStyle<TextStyle> = {
        default: {
        }
    }
}
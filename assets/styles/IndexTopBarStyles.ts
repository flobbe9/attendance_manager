import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";
import { FONT_SIZE, FONT_SIZE_SMALLER, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";


export class IndexTopBarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            position: "absolute", 
            right: GLOBAL_SCREEN_PADDING,
            top: GLOBAL_SCREEN_PADDING,
            ...HelperStyles.fullWidth
        }
    }

    static ExaminantCount: DynamicStyle<ViewStyle> = {
        default: {
            marginStart: GLOBAL_SCREEN_PADDING
        }
    }

    static text: TextStyle = {
        fontSize: FONT_SIZE_SMALLER
    }
}
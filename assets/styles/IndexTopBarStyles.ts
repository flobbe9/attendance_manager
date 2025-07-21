import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";
import { BORDER_RADIUS, FONT_SIZE, FONT_SIZE_LARGER, FONT_SIZE_SMALLER, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";


export class IndexTopBarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            position: "absolute", 
            right: GLOBAL_SCREEN_PADDING,
            top: GLOBAL_SCREEN_PADDING,
            zIndex: 1,
            ...HelperStyles.fullWidth
        }
    }

    static settingsButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "transparent",
            borderRadius: "100%",
        }
    }

    static gearIcon: TextStyle = {
        height: FONT_SIZE_LARGER,
        paddingLeft: 1, // center icon
        width: FONT_SIZE_LARGER,
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
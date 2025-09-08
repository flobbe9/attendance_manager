import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";

export class SettingsIndexStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            padding: GLOBAL_SCREEN_PADDING   
        }
    }

    static settingsItemButtonContainer: DynamicStyle<ViewStyle> = {
        default: {
            padding: GLOBAL_SCREEN_PADDING,
            ...HelperStyles.fullWidth,
        }
    }

    static settingsItemButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "rgb(231, 231, 231)",
            borderRadius: BORDER_RADIUS,
            justifyContent: "flex-start",
            padding: GLOBAL_SCREEN_PADDING,
            ...HelperStyles.fullWidth
        }
    }

    static settingsItemText: TextStyle = {
        fontSize: FONT_SIZE
    }
}
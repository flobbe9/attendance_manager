import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, FONT_SIZE } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

const warnColor = "rgb(255, 200, 0)";
export class backupStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {},
    };

    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS
        }
    }

    static warn: TextStyle & ViewStyle = {
        borderColor: warnColor,
        color: warnColor
    }

    static warnIcon: TextStyle = {
        fontSize: FONT_SIZE,
        textAlign: "center",
        ...this.warn
    }

    static buttonWarn: DynamicStyle<ViewStyle> = {
        default: {
            borderWidth: 2, 
            ...this.warn
        }
    }

    static link: TextStyle = {
        color: "blue"
    }

    static buttonContent: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE
        }
    }
}

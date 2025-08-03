import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class SettingsStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {},
    };

    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE,
            marginBottom: 20
        }
    }
}

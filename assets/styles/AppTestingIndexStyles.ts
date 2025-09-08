import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class AppTestingIndexStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {},
    };

    static buttonContent: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE
        }
    }
}

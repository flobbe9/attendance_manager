import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class PopupsStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            padding: GLOBAL_SCREEN_PADDING           
        }
    }
}
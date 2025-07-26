import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE } from "@/utils/styleConstants";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";

export class PopupStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            bottom: 80,
            position: "absolute",
            ...HS.fullWidth
        },
    };
    
    static container: DynamicStyle<ViewStyle> = {
        default: {
            ...HS.fitContent,
            padding: 10,
            borderRadius: 25,
            backgroundColor: "rgb(220, 220, 220)",
        },
    };

    static favicon: ImageStyle = {
        height: FONT_SIZE,
        width: FONT_SIZE,
    }

    static message: DynamicStyle<TextStyle> = {
        default: {
            flexShrink: 1
        }
    }
}

import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class LayoutStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    }

    static headerContent: TextStyle = {
        fontSize: FONT_SIZE,
        marginEnd: 10, 
    }

    static drawerButton: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: "100%", 
            height: 50, 
            width: 50
        }
    }
}
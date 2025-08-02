import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class LayoutStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {

        }
    }

    static headerIcon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
        marginEnd: 10, 
        paddingTop: 2,
    }

    static drawerIcon: TextStyle = {
        fontSize: this.headerIcon.fontSize
    }
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";


export class LayoutStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {

        }
    }

    static headerIcon: TextStyle = {
        marginEnd: 10, 
        paddingTop: 2,
    }
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";


export class CustomSnackbarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {},
    };
    
    static label: TextStyle = {
        padding: 5,
    };
}

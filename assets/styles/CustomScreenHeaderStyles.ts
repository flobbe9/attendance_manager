import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";

export class CustomScreenHeaderStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "white"
        },
    };
}
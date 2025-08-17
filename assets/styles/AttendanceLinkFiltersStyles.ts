import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";

const borderRadius = 20;

export class AttendanceLinkFiltersStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        },
    };
    
    static filterInput: ViewStyle = {
        backgroundColor: "rgb(230, 230, 230)",
        borderRadius: borderRadius,
        borderWidth: 0,
    }

    static filterValueButton: ViewStyle = {
        borderBottomEndRadius: borderRadius,
        borderBottomStartRadius: borderRadius,
        borderTopEndRadius: borderRadius,
        borderTopStartRadius: borderRadius,
        borderWidth: 0,
    }
}

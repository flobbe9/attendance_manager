import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE, LIGHT_COLOR } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";

const borderRadius = 20;

export class AttendanceLinkFiltersStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth
        },
    };

    static column: ViewStyle = {
        margin: 5
    }
    
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

    static futureCheckboxContent: TextStyle = {
        fontSize: FONT_SIZE
    }

    
    static sortButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: LIGHT_COLOR,
            borderRadius: 20, 
            borderWidth: 1, 
            paddingVertical: 1,
        }
    }

    static sortButtonIconOffset = 7;
    static sortButtonIcon: TextStyle = {
        fontSize: FONT_SIZE,
    }
}

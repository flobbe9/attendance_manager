import {DynamicStyle} from "@/abstract/DynamicStyle";
import {FONT_SIZE_LARGER, GLOBAL_SCREEN_PADDING} from "@/utils/styleConstants";
import {TextStyle, ViewStyle} from "react-native";

export class ExaminantInputStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {},
    };

    static checkboxContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginRight: 30,
            marginTop: GLOBAL_SCREEN_PADDING + 5, // The padding a <List.Accordion> element has, which I can't get rid of
        },
    };

    static checkbox: DynamicStyle<ViewStyle> = {
        default: {
            flexWrap: "nowrap",
            padding: 5
        },
    };

    static checkboxIcon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
    };

    static icon: TextStyle = {
        fontSize: FONT_SIZE_LARGER + 10,
        flexShrink: 0,
    };
}

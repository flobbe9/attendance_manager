import {DynamicStyle} from "@/abstract/DynamicStyle";
import {TextStyle, ViewStyle} from "react-native";
import HS from "./helperStyles";
import {GLOBAL_SCREEN_PADDING} from "@/utils/styleConstants";

const fontSize = 15;

export class HelperSelectStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            width: "100%",
            zIndex: 1,
        },
    };

    // NOTE: dont pass touchStart event, since the props.touchStart would loos it's state
    static selectionButton: DynamicStyle<ViewStyle> = {
        default: {
            borderBottomWidth: 1,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            padding: GLOBAL_SCREEN_PADDING,
            width: "100%",
        },
    };

    static selectionButtonValue: DynamicStyle<TextStyle> = {
        default: {
            backgroundColor: "transparent",
            borderWidth: 0,
            flexShrink: 1,
            fontSize: fontSize,
            padding: 0,
        },
    };

    static optionsContainer: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "white",
            width: "100%",
        },
    };

    static optionButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "white",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            paddingBottom: GLOBAL_SCREEN_PADDING,
            paddingTop: GLOBAL_SCREEN_PADDING,
            width: "100%",
        },
    };

    static selectedOptionButton: DynamicStyle<ViewStyle> = {
        default: {
            ...this.optionButton.default,
            backgroundColor: "rgb(200, 200, 200)",
        },
    };

    static optionButtonText: DynamicStyle<TextStyle> = {
        default: {
            flexShrink: 1,
            fontSize: fontSize,
        },
    };
}

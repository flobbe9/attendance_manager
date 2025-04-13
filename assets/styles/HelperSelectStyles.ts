import { DynamicStyles } from "@/abstract/DynamicStyles";
import { TextStyle, ViewStyle } from "react-native";
import { componentPadding } from "./AttendanceIndexStyles";
import { HelperStyles } from './helperStyles';

const fontSize = 15;

export class HelperSelectStyles {
    static component: DynamicStyles<ViewStyle> = {
        default: {
            width: "100%",
            zIndex: 1
        }
    }

    // NOTE: dont pass touchStart event, since the props.touchStart would loos it's state
    static selectionButton: DynamicStyles<ViewStyle> = {
        default: {
            borderBottomWidth: 1,
            justifyContent: "space-between",
            padding: componentPadding,
            width: "100%",
        }
    }

    static selectionButtonValue: DynamicStyles<TextStyle> = {
        default: {
            backgroundColor: "transparent",
            borderWidth: 0,
            fontSize: fontSize,
            padding: 0
        }
    }

    static optionsContainer: ViewStyle = {
        backgroundColor: "white",
        width: "100%",
    }

    static optionButton: DynamicStyles<ViewStyle> = {
        default: {
            backgroundColor: "white",
            justifyContent: "space-between",
            paddingBottom: componentPadding,
            paddingTop: componentPadding,
            width: "100%",
        },
    }

    static optionButtonText: DynamicStyles<TextStyle> = {
        default: {
            fontSize: fontSize
        }
    }
}
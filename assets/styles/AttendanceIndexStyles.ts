import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BOLD, BORDER_RADIUS, FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import { default as HelperStyles, default as HS } from "./helperStyles";

const defaultInputBackground = "rgb(255, 255, 255)";

export class AttendanceIndexStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            height: "100%",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    static suspenseContainer: ViewStyle = {
        ...this.component.default,
        ...HelperStyles.fullHeight, 
        ...HelperStyles.flexCenterCenter, 
    }

    static scrollView: DynamicStyle<ViewStyle> = {
        default: {
        }
    }
    
    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE,
            fontWeight: BOLD,
            marginBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static subHeading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: 17,
        }
    }

    static topBarContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth,
            zIndex: 1,
        }
    }

    static inputContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginBottom: 30
        }
    }

    static defaultHelperInputContainer: DynamicStyle<ViewStyle & TextStyle> = {
        default: {
            backgroundColor: defaultInputBackground,
        },
        focus: {
            backgroundColor: defaultInputBackground
        }
    }

    static defaultHelperButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: defaultInputBackground
        }
    }

    static defaultMultilineHelperInput: DynamicStyle<TextStyle> = {
        default: {
            ...HS.flexCenter,
            maxHeight: 200
        }
    }

    static notesContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HS.fullWidth,
            marginBottom: 60,
            marginTop: 50,
        }
    }

    static moreButton: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS, 
            width: 100
        }
    }
}
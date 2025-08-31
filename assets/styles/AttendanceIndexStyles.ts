import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ATTENDANCE_TEXT_INPUT_OPACITY, BOLD, BORDER_RADIUS, FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";

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
        ...HS.fullHeight, 
        ...HS.flexCenterCenter, 
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
            ...HS.fullWidth,
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
            opacity: ATTENDANCE_TEXT_INPUT_OPACITY
        },
        focus: {
            backgroundColor: defaultInputBackground,
        },
    }

    static defaultHelperButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: defaultInputBackground,
        }
    }
    
    static defaultHelperButtonContainer: DynamicStyle<ViewStyle> = {
        default: {
            opacity: ATTENDANCE_TEXT_INPUT_OPACITY
        }
    }
    static defaultHelperButtonRippleBackground = "rgba(200, 200, 200, .7)";

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
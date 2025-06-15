import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";
import HelperStyles from "./helperStyles";


export class AttendanceStyles {
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
            marginTop: GLOBAL_SCREEN_PADDING,
            marginBottom: 40, // more than padding sothat keyboard does not cover bottom input
        }
    }
    
    static heading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static subHeading: DynamicStyle<TextStyle> = {
        default: {
            fontSize: 17,
        }
    }

    static inputContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginBottom: 30
        }
    }

    static defaultHelperInputContainer: DynamicStyle<ViewStyle & TextStyle> = {
        default: {
            backgroundColor: "rgb(220, 220, 220)",
        },
        focus: {
            backgroundColor: "rgb(240, 240, 240)"
        }
    }

    static defaultMultilineHelperInput: DynamicStyle<TextStyle> = {
        default: {
            ...HS.flexCenter,
            maxHeight: 200,
            minHeight: 80,
        }
    }

    static notesContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HS.fullWidth,
            marginBottom: 60,
            marginTop: 50,
        }
    }
}
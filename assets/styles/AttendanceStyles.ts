import { DynamicStyle } from "@/abstract/DynamicStyle";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";


type StyleType = ViewStyle;

/** The padding a <List.Accordion> element has, which I can't get rid of */
const accordionPadding = 5;


export class AttendanceStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            height: "100%",
            padding: GLOBAL_SCREEN_PADDING,
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
            ...this.defaultHelperInputContainer.default,
            ...HS.flexCenter,
            maxHeight: 200,
            minHeight: 80,
        },
        focus: {
            ...this.defaultHelperInputContainer.focus
        }
    }

    static examinerIconContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginRight: 10,
            marginTop: GLOBAL_SCREEN_PADDING + accordionPadding
        }
    }
    
    static examinerIcon: TextStyle = {
        fontSize: 30,
        flexShrink: 0,
        marginRight: 5,
        marginTop: 15
    }

    static notesContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HS.fullWidth,
            marginBottom: 60,
            marginTop: 50,
        }
    }
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";
import { BORDER_RADIUS, FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import HelperStyles from "./helperStyles";

type StyleType = ViewStyle;

const addButtonWidth = 59;

export class IndexStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            minHeight: "100%",
            padding: GLOBAL_SCREEN_PADDING,
            backgroundColor: "white"
        }
    }

    static emptyMessage: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE
        }
    }

    static sortButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "transparent"
        }
    }

    static sortButtonIcon: TextStyle = {
        fontSize: FONT_SIZE
    }
    
    static linkContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth,
            height: 0 // for scroll to work, don't ask xd
        }
    }

    static attendanceLinkLabel: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE,
            marginBottom: 5
        }
    }

    static attendanceLinkDevider: ViewStyle = {
        marginTop: 10, 
        marginBottom: 15
    }

    static attendanceLink: DynamicStyle<StyleType> = {
        default: {
            marginBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static addButtonContainer: DynamicStyle<StyleType> = {
        default: {
            bottom: GLOBAL_SCREEN_PADDING * 2,
            position: "absolute",
            right: GLOBAL_SCREEN_PADDING * 2,
        }
    }

    static sendLogsButtonContainer: DynamicStyle<StyleType> = {
        default: {
            bottom: this.addButtonContainer.default.bottom,
            position: this.addButtonContainer.default.position,
            left: this.addButtonContainer.default.right
        }
    }
    
    static addButton: DynamicStyle<StyleType> = {
        default: {
            backgroundColor: "rgb(0, 0, 0)",
            height: addButtonWidth,
            paddingStart: 20,
            paddingEnd: 20,
            width: addButtonWidth
        }
    }

    static addButtonLabel: DynamicStyle<TextStyle> = {
        default: {
            color: "white",
            fontSize: FONT_SIZE,
        }
    }
}
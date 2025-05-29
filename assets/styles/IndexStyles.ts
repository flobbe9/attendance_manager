import { DynamicStyle } from "@/abstract/DynamicStyle";
import { TextStyle, ViewStyle } from "react-native";
import HS from "./helperStyles";
import { BORDER_RADIUS, FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import HelperStyles from "./helperStyles";


type StyleType = ViewStyle;

const addButtonWidth = 59;
const addButtonFontSize = 20;


export class IndexStyles {
    static component: DynamicStyle<StyleType> = {
        default: {
            minHeight: "100%",
            padding: GLOBAL_SCREEN_PADDING,
        }
    }

    static emptyMessage: DynamicStyle<TextStyle> = {
        default: {
            fontSize: FONT_SIZE
        }
    }
    
    static linkContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth
        }
    }

    static link: DynamicStyle<StyleType> = {
        default: {
            marginBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static addButtonOuterView: DynamicStyle<StyleType> = {
        default: {
            bottom: GLOBAL_SCREEN_PADDING * 2,
            position: "absolute",
            right: GLOBAL_SCREEN_PADDING * 2,
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
            fontSize: addButtonFontSize
        }
    }

    static buttonIcon: TextStyle = {
        fontSize: addButtonFontSize,
        ...HS.fitContent
    }
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";


export class ToastStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            position: "relative" // for toast footer to stay in bound
        }
    }
    
    static childrenContainer: ViewStyle = {
        backgroundColor: "white",
        borderRadius: BORDER_RADIUS,
        ...HelperStyles.flexStartStart,
        flexDirection: "column",
        maxHeight: "80%",
        maxWidth: "90%",
        minHeight: 100,
        minWidth: 100,
        margin: "auto",
        padding: GLOBAL_SCREEN_PADDING,
    }


    static defaultFooter: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: this.childrenContainer.backgroundColor,
            bottom: this.childrenContainer.padding,
            right: this.childrenContainer.padding
        }
    }
}
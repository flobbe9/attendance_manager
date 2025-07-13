import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class TopBarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            paddingBottom: GLOBAL_SCREEN_PADDING
        }
    }

    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS,
            margin: 0,
            paddingHorizontal: 25
        }
    }

    static deleteButton: DynamicStyle<ViewStyle> = {
        default: {
            ...this.button.default,
            backgroundColor: "rgb(255, 81, 81)",
        }
    }

    static saveButton: DynamicStyle<ViewStyle> = {
        default: {
            ...this.button.default,
            backgroundColor: "rgb(100, 200, 50)",
        }
    }


    static saveButtonChildren: DynamicStyle<TextStyle> = {
        default: {
        }
    }

    static errorToast: ViewStyle = {
        
    }
}
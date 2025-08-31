import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS, FONT_SIZE, LIGHT_COLOR } from "@/utils/styleConstants";
import { ViewStyle } from "react-native";

export class DateInputStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    };
    
    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS, 
            minWidth: 100,
        }
    }

    static clearButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: 'transparent',
            borderColor: "rgb(150, 150, 150)",
            borderRadius: BORDER_RADIUS,
            borderWidth: 1,
        }
    }
}

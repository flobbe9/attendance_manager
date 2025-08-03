import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";
import { BORDER_RADIUS } from "@/utils/styleConstants";

export class DateInputStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    };
    
    static button: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS, 
            minWidth: 100
        }
    }
}

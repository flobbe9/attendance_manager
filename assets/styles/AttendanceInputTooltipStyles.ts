import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";

export class AttendanceInputTooltipStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            marginStart: 10
        }
    }

    static icon: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
    }

    static buttonContainer: DynamicStyle<ViewStyle> = {
        default: {
            // marginStart: 10
        }
    }

    static button: ViewStyle = {
        // make button a square
        height: FONT_SIZE_LARGER + 20,
        width: FONT_SIZE_LARGER + 20
    }
}
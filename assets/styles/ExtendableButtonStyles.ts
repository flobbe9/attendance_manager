import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS } from "@/utils/styleConstants";
import { ViewStyle } from "react-native";


export class ExtendableButtonStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: BORDER_RADIUS,
            flexWrap: "nowrap"
        }
    }
}
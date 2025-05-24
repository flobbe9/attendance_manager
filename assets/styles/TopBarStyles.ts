import { DynamicStyle } from "@/abstract/DynamicStyle";
import { BORDER_RADIUS } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class TopBarStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {

        }
    }

    static saveButton: DynamicStyle<ViewStyle> = {
        default: {
            backgroundColor: "rgb(100, 200, 50)",
            borderRadius: BORDER_RADIUS,
            margin: 0,
        }
    }


    static saveButtonChildren: DynamicStyle<TextStyle> = {
        default: {
        }
    }
}
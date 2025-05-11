import { DynamicStyle } from "@/abstract/DynamicStyle";
import { ViewStyle } from "react-native";
import HelperStyles from "./helperStyles";


export class PopupStyles {

    static component: DynamicStyle<ViewStyle> = {
        default: {
            bottom: 80,
            position: "absolute",
            ...HelperStyles.fullWidth,
        }
    }


    static container: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fitContent,
            padding: 10,
            borderRadius: 25,
            backgroundColor: "white",
        }
    }
}
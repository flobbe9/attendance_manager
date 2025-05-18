import { DynamicStyle } from "@/abstract/DynamicStyle";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class ExaminantInputStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {

        }
    }

    
    static iconContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginRight: 10,
            marginTop: GLOBAL_SCREEN_PADDING + 5  // The padding a <List.Accordion> element has, which I can't get rid of
        }
    }
    
    static icon: TextStyle = {
        fontSize: 30,
        flexShrink: 0,
        marginRight: 5,
        marginTop: 15
    }
}
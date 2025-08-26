import { DynamicStyle } from "@/abstract/DynamicStyle";
import { FONT_SIZE, FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";


export class LayoutStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
        }
    }

    /** For header titles that are not part of <CustomScreenHeader /> but need to be centered */
    static headerTitleNegativeOffset = -55;
    static headerContent: TextStyle = {
        fontSize: FONT_SIZE_LARGER,
        textAlign: 'center',
    }

    static drawerButtonContainer: DynamicStyle<ViewStyle> = {
        default: {
            marginStart: 5
        }
    }

    static drawerButton: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: "100%", 
            padding: 5,
            height: 50, 
            width: 50
        }
    }
}
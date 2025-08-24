import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperStyles from '@/assets/styles/helperStyles';
import { FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { TextStyle, ViewStyle } from "react-native";
import { HelperButtonStyles } from "./HelperButtonStyles";

export class DrawerContentStyles {
    static component: DynamicStyle<ViewStyle> = {
        default: {
            padding: 20,
        },
    };

    static linkButtonContainer: DynamicStyle<ViewStyle> = {
        default: {
            ...HelperStyles.fullWidth,
        }
    }
    
    static linkButton: DynamicStyle<ViewStyle> = {
        default: {
            borderRadius: 40,
            justifyContent: "flex-start",
            ...HelperStyles.fullWidth,
            ...HelperButtonStyles.minimalistic.default
        },
    }

    static icon: TextStyle = {
        marginRight: GLOBAL_SCREEN_PADDING
    }

    static linkButtonContent: TextStyle = {
        fontSize: FONT_SIZE,
    }
}

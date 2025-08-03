import { TextStyle, TextProps, ColorValue } from "react-native";
import { FontAweSomeIconname } from "./FontAwesomeIconName";
import HelperProps from "./HelperProps";

/**
 * @since latest
 */
export interface FontAwesomeProps extends HelperProps<TextStyle>, TextProps {
    size?: number;
    color?: ColorValue;
    name?: FontAweSomeIconname;
}
import { ReactNode } from "react";
import { StyleProp } from "react-native";


/**
 * @since 0.0.1
 */
export default interface DefaultProps<StyleType> {

    id?: string,
    className?: string,
    children?: ReactNode,
    style?: StyleProp<StyleType>,
}
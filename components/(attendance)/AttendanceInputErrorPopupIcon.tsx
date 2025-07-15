import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import { ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR, FONT_SIZE_SMALLER } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ColorValue, TextProps, TextStyle } from "react-native";

interface Props extends HelperProps<TextStyle>, TextProps {
    size?: number,
    color?: ColorValue
}

/**
 * @since 0.0.1
 */
export default function AttendanceInputErrorPopupIcon({...props}: Props) {

    const componentName = "AttendanceInputErrorPopupicon";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    return (
        <FontAwesome 
            name="info-circle" 
            size={FONT_SIZE_SMALLER} 
            color={ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR} 
            {...otherProps}
        />
    )
}
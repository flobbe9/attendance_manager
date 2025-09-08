import { FontAwesomeProps } from "@/abstract/FontAwesomeProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import { ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR, ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_ICON, FONT_SIZE_SMALLER } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { Fragment, useEffect } from "react";

interface Props extends FontAwesomeProps {}

/**
 * @since 0.0.1
 */
export default function AttendanceInputErrorPopupIcon({ rendered = true, onRender, ...props }: Props) {
    const componentName = "AttendanceInputErrorPopupicon";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        if (rendered && onRender) onRender();
    }, []);

    if (!rendered) return <Fragment />;

    return <FontAwesome name={ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_ICON} size={FONT_SIZE_SMALLER} color={ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR} {...otherProps} />;
}

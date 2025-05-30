import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import Tooltip from "../helpers/Tooltip";
import { ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR } from "@/utils/styleConstants";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * Helper tooltip to enable flashing icon color.
 * 
 * @since 0.0.1
 */
export default function AttendanceInputTooltip({...props}: Props) {

    const { tooltipIconColor, setTooltipIconColor } = useContext(AttendanceContext);

    const componentName = "AttendanceInputTooltip";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    return (
        <Tooltip 
            iconStyle={{
                color: tooltipIconColor
            }}
            onTouchStart={() => setTooltipIconColor(ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR)} // make sure to reset possible error style
            {...otherProps}
        >
            {children}
        </Tooltip>
    )
}
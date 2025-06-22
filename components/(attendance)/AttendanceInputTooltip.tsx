import HelperProps from "@/abstract/HelperProps";
import { AttendanceInputTooltipStyles } from "@/assets/styles/AttendanceInputTooltipStyles";
import { AttendanceEntity } from "@/backend/DbSchema";
import { useHelperProps } from "@/hooks/useHelperProps";
import { ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR } from "@/utils/styleConstants";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import Tooltip from "../helpers/Tooltip";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    attendanceInputKey: keyof AttendanceEntity
}

/**
 * Helper tooltip to enable flashing icon color.
 * 
 * @since 0.0.1
 */
export default function AttendanceInputTooltip({attendanceInputKey, ...props}: Props) {

    const { tooltipIconColor, setTooltipIconColor, currentlyInvalidAttendanceInputKey } = useContext(AttendanceContext);

    const componentName = "AttendanceInputTooltip";
    const { children, ...otherProps } = useHelperProps(props, componentName, AttendanceInputTooltipStyles.component);

    return (
        <Tooltip 
            iconStyle={{
                color: currentlyInvalidAttendanceInputKey === attendanceInputKey ?  tooltipIconColor : ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
                ...AttendanceInputTooltipStyles.icon
            }}
            iconAlign="right"
            buttonStyles={{
                containerStyles: {
                    ...AttendanceInputTooltipStyles.buttonContainer
                },
                style: {
                    ...AttendanceInputTooltipStyles.button
                },
            }}
            onTouchStart={() => setTooltipIconColor(ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR)} // make sure to reset possible error style
            {...otherProps}
        >
            {children}
        </Tooltip>
    )
}
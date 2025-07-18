import {AttendanceInputTooltipStyles} from "@/assets/styles/AttendanceInputTooltipStyles";
import {AbstractAttendanceInputValidator} from "@/backend/abstract/AbstractAttendanceInputValidator";
import {useDeviceOrientation} from "@/hooks/useDeviceOrientation";
import {useHelperProps} from "@/hooks/useHelperProps";
import {ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR} from "@/utils/styleConstants";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {DependencyList} from "react-native-reanimated/lib/typescript/hook";
import {AttendanceContext} from "../context/AttendanceContextProvider";
import B from "../helpers/B";
import HelperReactChildren from "../helpers/HelperReactChildren";
import HelperText from "../helpers/HelperText";
import Tooltip, {TooltipProps} from "../helpers/Tooltip";
import {logDebug} from "@/utils/logUtils";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";

interface Props<InputType extends keyof AttendanceEntity> extends TooltipProps {
    values: ValueOf<AttendanceEntity>[];
    attendanceInputKey: keyof AttendanceEntity;
    validator: AbstractAttendanceInputValidator<InputType>; // comment out
    /** Displayed when `valueList` is empty. Has a generic default that should fit any input field. */
    emptyMessage?: string;
    /** Displayed above `valueList`. Default is `<B>Erlaubte Werte:</B>` */
    heading?: ReactNode;
    /** For updating the tooltip text. Default is `[currentAttendanceEntity]` */
    deps?: DependencyList;
    /**
     * Called when listing valid / invalid values. Should return a pretty string represenation
     * that's meant for the user. Default is `(value) => value.toString()`.
     */
    valueToStringPretty?: (value: ValueOf<AttendanceEntity>, index?: number) => string;
}

/**
 * Helper tooltip to enable flashing icon color.
 *
 * @since 0.0.1
 */
export default function AttendanceInputTooltip<InputType extends keyof AttendanceEntity>({
    values,
    attendanceInputKey,
    validator,
    emptyMessage = "Keine Auswahl möglich in Kombination mit den restlichen Werten.",
    heading = <B>Erlaubte Werte:</B>,
    deps,
    textContainerStyles,
    buttonStyles,
    iconStyle,
    onTouchStart,
    valueToStringPretty = (value) => value.toString(),
    ...props
}: Props<InputType>) {
    const {
        tooltipIconColor,
        setTooltipIconColor,
        currentlyInvalidAttendanceInputKey,
        currentAttendanceEntity,
    } = useContext(AttendanceContext);

    const [tooltipText, setTooltipText] = useState<ReactNode>("");

    const componentName = "AttendanceInputTooltip";
    const {children, ...otherProps} = useHelperProps(
        props,
        componentName,
        AttendanceInputTooltipStyles.component
    );

    const orientation = useDeviceOrientation();

    useEffect(() => {
        setTooltipText(generateTooltipText());
    }, [...(deps ?? [currentAttendanceEntity]), values]);

    function generateTooltipText(): ReactNode {
        if (!values || !values.length) return emptyMessage;

        let reducedValues = "";

        // reduce is not called on an array with 1 element
        if (values.length === 1) reducedValues = valueToStringPretty(values[0]);
        else
            reducedValues = values.reduce((prev, cur, i) => {
                // case: prev is already a concatenation, dont format
                if (i > 1) return `${prev}, ${valueToStringPretty(cur, i)}`;

                return `${valueToStringPretty(prev, i)}, ${valueToStringPretty(cur, i)}`;
            }) as string;

        // remove the first line break in case there is one
        reducedValues =
            reducedValues.charAt(0) === "\n" ? reducedValues.substring(1) : reducedValues;

        return <HelperText>{reducedValues}</HelperText>;
    }

    function handleTouchStart(event): void {
        if (onTouchStart) onTouchStart(event);

        // make sure to reset possible error style
        setTooltipIconColor(ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR);
    }

    return (
        <Tooltip
            iconStyle={{
                color:
                    currentlyInvalidAttendanceInputKey === attendanceInputKey
                        ? tooltipIconColor
                        : ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
                ...AttendanceInputTooltipStyles.icon,
                ...iconStyle,
            }}
            position="right"
            buttonStyles={{
                style: {
                    ...AttendanceInputTooltipStyles.button,
                    ...buttonStyles,
                },
            }}
            textContainerStyles={{
                ...AttendanceInputTooltipStyles.textContainerStyles,
                maxWidth: orientation === "landscape" ? 400 : 200,
                ...textContainerStyles,
            }}
            duration={NaN}
            onTouchStart={handleTouchStart}
            {...otherProps}
        >
            <HelperReactChildren rendered={emptyMessage != tooltipText}>
                {heading}
            </HelperReactChildren>

            <HelperReactChildren>{tooltipText}</HelperReactChildren>

            {children}
        </Tooltip>
    );
}

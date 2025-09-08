import { FontAwesomeProps } from "@/abstract/FontAwesomeProps";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceInputTooltipStyles } from "@/assets/styles/AttendanceInputTooltipStyles";
import { AbstractAttendanceInputValidator } from "@/backend/abstract/AbstractAttendanceInputValidator";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { useHelperProps } from "@/hooks/useHelperProps";
import {
    ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
    TOOLTIP_DEFAULT_ICON
} from "@/utils/styleConstants";
import { isBlank, isFalsy } from "@/utils/utils";
import React, { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { DependencyList } from "react-native-reanimated/lib/typescript/hook";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import B from "../helpers/B";
import HelperButton, { HelperButtonProps } from "../helpers/HelperButton";
import HelperReactChildren from "../helpers/HelperReactChildren";
import P from "../helpers/P";
import Tooltip, { TooltipProps } from "../helpers/Tooltip";
import AttendanceInputErrorPopupIcon from "./AttendanceInputErrorPopupIcon";

interface Props<InputType extends keyof AttendanceEntity, ValuesType extends Map<ValueOf<AttendanceEntity>, string> | ValueOf<AttendanceEntity>[]>
    extends TooltipProps {
    values: ValuesType;
    attendanceInputKey: keyof AttendanceEntity;
    validator: AbstractAttendanceInputValidator<InputType>; // comment out
    /** Displayed when `valueList` is empty. Has a generic default that should fit any input field. */
    emptyMessage?: string;
    /** Displayed above `valueList`. Default is `<B>Erlaubte Werte:</B>` */
    heading?: ReactNode;
    /** For updating the tooltip text. Default is `[currentAttendanceEntity]` */
    deps?: DependencyList;
}

/**
 * Helper tooltip to enable flashing icon color.
 *
 * @since 0.0.1
 */
export default function AttendanceInputTooltip<
    InputType extends keyof AttendanceEntity,
    ValuesType extends Map<ValueOf<AttendanceEntity>, string> | ValueOf<AttendanceEntity>[]
>({
    values,
    attendanceInputKey,
    validator,
    emptyMessage,
    heading,
    deps,
    textContainerStyles,
    iconProps,
    onTouchStart,
    ...props
}: Props<InputType, ValuesType>) {
    const { snackbar, prs } = useContext(GlobalContext);
    const { tooltipIconColor, setTooltipIconColor, currentlyInvalidAttendanceInputKey, currentAttendanceEntity } = useContext(AttendanceContext);

    const [tooltipContent, setTooltipContent] = useState<ReactNode>();

    const [valuesLength, setValuesLength] = useState(0);

    const componentName = "AttendanceInputTooltip";
    const { children, ...otherProps } = useHelperProps(props, componentName, AttendanceInputTooltipStyles.component);

    const buttonProps: HelperButtonProps = {
        style: {
            ...AttendanceInputTooltipStyles.button,
        },
        ripple: { rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground },
    };
    const finalIconProps: FontAwesomeProps = {
        style: {
            ...AttendanceInputTooltipStyles.icon,
        },
    };

    const orientation = useDeviceOrientation();

    useEffect(() => {
        const tooltipContent = generateTooltipContent();
        setTooltipContent(tooltipContent);

        setValuesLength(getValuesLength());
    }, [...(deps ?? [currentAttendanceEntity]), values]);

    function getValuesLength(): number {
        return Array.isArray(values) ? values.length : values.size;
    }

    function generateTooltipContent(): ReactNode {
        if (!values || !getValuesLength()) return getEmptyMessage();

        return isValidValues() ? validator.formatValidValues(values as Date[]) : validator.formatInvalidValues(values as Map<Date, string>);
    }

    function handleTouchStart(event): void {
        if (onTouchStart) onTouchStart(event);

        // make sure to reset possible error style
        setTooltipIconColor(ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR);
    }

    function getHeading(): ReactNode {
        if (!isFalsy(heading)) return heading;

        return <P style={{...(isValidValues() ? {} : prs("mb_2"))}}>{isValidValues() ? <B>Erlaubte Werte:</B> : <B>Nicht auswählbare Werte</B>}</P>;
    }

    function getEmptyMessage(): string {
        if (!isBlank(emptyMessage)) return emptyMessage;

        return isValidValues() ? "Keine Auswahl möglich in Kombination mit den restlichen Werten." : "Alle Werte erlaubt";
    }

    /**
     * Whether `values` prop contains valid values instead of invalid ones. Invalid values are formatted as `Map<value, errorMessage>`,
     * valid values are formatted as `value[]`.
     *
     * @returns `true` if `propsValues` is an array
     */
    function isValidValues(): boolean {
        return Array.isArray(values);
    }

    /**
     * @param tooltipContent pass as arg, dont use state or function wont adjust to state changes
     */
    function showInvalidValues(): void {
        snackbar(
            <Fragment>
                <HelperReactChildren rendered={!!valuesLength}>{getHeading()}</HelperReactChildren>

                <HelperReactChildren>{tooltipContent}</HelperReactChildren>
            </Fragment>
        );
    }

    return isValidValues() ? (
        <Tooltip
            iconProps={{
                color: currentlyInvalidAttendanceInputKey === attendanceInputKey ? tooltipIconColor : ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
                name: TOOLTIP_DEFAULT_ICON,
                ...finalIconProps,
            }}
            position="right"
            buttonProps={buttonProps}
            textContainerStyles={{
                ...AttendanceInputTooltipStyles.textContainerStyles,
                maxWidth:
                    orientation === "landscape" ? AttendanceInputTooltipStyles.maxWidthLandscape : AttendanceInputTooltipStyles.maxWidthPortrait,
                ...textContainerStyles,
            }}
            duration={NaN}
            onTouchStart={handleTouchStart}
            {...otherProps}
        >
            <HelperReactChildren rendered={!!valuesLength}>{getHeading()}</HelperReactChildren>

            <HelperReactChildren>{tooltipContent}</HelperReactChildren>

            {children}
        </Tooltip>
    ) : (
        <HelperButton {...buttonProps} onPress={() => showInvalidValues()}>
            <AttendanceInputErrorPopupIcon {...finalIconProps} />
        </HelperButton>
    );
}

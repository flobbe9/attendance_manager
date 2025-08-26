import HelperProps from "@/abstract/HelperProps";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import B from "../helpers/B";
import Br from "../helpers/Br";
import Flex from "../helpers/Flex";
import HelperCheckbox from "../helpers/HelperCheckbox";
import HelperText from "../helpers/HelperText";
import AttendanceInputErrorPopupIcon from "./AttendanceInputErrorPopupIcon";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    reason: string;
    invalidValue: string | number;
}

/**
 * The content of the snackbar when an attendance input value is invalid.
 *
 * @since 0.0.1
 */
export default function AttendanceInputErrorSnackbarContent({ reason, invalidValue, ...props }: Props) {
    const { prs } = useContext(GlobalContext);

    const { dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup } = useContext(GlobalAttendanceContext);

    const componentName = "AttendanceInputErrorSnackbarContent";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    return (
        <HelperView {...otherProps}>
            <Flex flexWrap="nowrap" alignItems="center">
                <HelperView style={{ ...prs("me_2") }}>
                    <AttendanceInputErrorPopupIcon />
                </HelperView>

                <B>'{invalidValue}' kann nicht ausgewählt werden.</B>
            </Flex>

            <Br />

            <HelperText>{reason}</HelperText>

            <Br />

            <HelperText>Um alle erlaubten Werte anzuzeigen, tippe auf die Glühbirne neben der Feldüberschrift.</HelperText>

            <Br />

            <HelperCheckbox checked={dontShowInvalidInputErrorPopup} setChecked={setDontShowInvalidInputErrorPopup}>
                <HelperText>Nicht mehr anzeigen</HelperText>
            </HelperCheckbox>

            {children}
        </HelperView>
    );
}

import { combineDynamicStyles } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { DateInputStyles } from "@/assets/styles/DateInputStyles";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import DatePicker, { DatePickerValue } from "../helpers/DatePicker";
import Flex from "../helpers/Flex";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function DateInput({ ...props }: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } =
        useContext(AttendanceContext);

    const {
        allStyles: { mb_2 },
    } = useResponsiveStyles();

    const [invalidValues, setInvalidValues] = useState<Map<Date, string>>(new Map());

    const validator = AttendanceInputValidatorBuilder.builder(currentAttendanceEntity, savedAttendanceEntities).inputType("date").build();

    const componentName = "DateInput";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, DateInputStyles.component);

    useEffect(() => {
        setInvalidValues(validator.getInvalidValues() as Map<Date, string>);
    }, [currentAttendanceEntity]);

    function handleConfirm(params: DatePickerValue): void {
        const date = params.date;
        const errorMessage = validator.validate(date);

        // case: valid
        if (errorMessage === null) {
            resetInvalidAttendanceInputErrorStyles();
            return;
        }

        handleInvalidAttendanceInput(formatDateGermanNoTime(date), errorMessage, "date");

        // prevent set state
        throw new Error(errorMessage);
    }

    return (
        <HelperView dynamicStyle={AttendanceIndexStyles.inputContainer} style={{ ...(style as object) }} {...otherProps}>
            <Flex alignItems="center" style={{ zIndex: 1 }}>
                <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Datum</HelperText>

                <AttendanceInputTooltip values={invalidValues} attendanceInputKey={"date"} validator={validator} />
            </Flex>

            <DatePicker
                date={currentAttendanceEntity.date}
                setDate={(date) => updateCurrentAttendanceEntity(["date", date])}
                dynamicStyle={combineDynamicStyles(DateInputStyles.button, AttendanceIndexStyles.defaultHelperButton)}
                ripple={{ rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground }}
                modalProps={{
                    emptyLabel: "__.__.____",
                    validRange: {
                        disabledDates: Array.from(invalidValues.keys()),
                    },
                }}
                onConfirm={handleConfirm}
            />

            {children}
        </HelperView>
    );
}

import HelperProps from "@/abstract/HelperProps";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
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
import B from "../helpers/B";

interface Props extends HelperProps<ViewStyle>, ViewProps {

}

/**
 * @since 0.0.1
 */
export default function DateInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } = useContext(AttendanceContext);

    const { allStyles: { mb_2 } } = useResponsiveStyles();

    const [invalidValues, setInvalidValues] = useState<Date[]>([]);

    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .inputType("date")
        .build();

    const componentName = "DateInput";
    const { children, style, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        setInvalidValues(validator.getInvalidValues() as Date[]);
    }, [currentAttendanceEntity])

    function handleConfirm(params: DatePickerValue): void {
        const date = params.date;
        const errorMessage = validator.validate(date);

        // case: valid
        if (errorMessage === null) {
            resetInvalidAttendanceInputErrorStyles();           
            return;
        }

        handleInvalidAttendanceInput(
            formatDateGermanNoTime(date),
            errorMessage,
            "date"
        )

        // prevent set state
        throw new Error(errorMessage);
    }

    /**
     * @param invalidValue 
     * @param index 
     * @returns one music lesson topic formatted for tooltip body
     */
    function formatTooltip(invalidValue: Date, index: number): string {
        const formattedDate = formatDateGermanNoTime(invalidValue);
        const prefix = index >= 1 ? '\n' : '';
        return `${prefix}${formattedDate}`;
    }
    
    return (
        <HelperView dynamicStyle={AttendanceIndexStyles.inputContainer} style={{...style as object, ...mb_2}} {...otherProps}>
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Datum</HelperText>

                <AttendanceInputTooltip 
                    values={invalidValues}
                    attendanceInputKey="date"
                    validator={validator}
                    emptyMessage="Alle Werte erlaubt."
                    heading={<B>Invalide Werte:</B>}
                    valueToStringPretty={formatTooltip}
                />
            </Flex>

            <DatePicker 
                date={currentAttendanceEntity.date} 
                setDate={(date) => updateCurrentAttendanceEntity(["date", date])}
                buttonStyles={AttendanceIndexStyles.defaultHelperButton}
                onConfirm={handleConfirm}         
            />
            
            {children}
        </HelperView>
    )
}
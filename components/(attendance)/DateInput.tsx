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
import Tooltip from "../helpers/Tooltip";
import { AttendanceInputTooltipStyles } from "@/assets/styles/AttendanceInputTooltipStyles";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";

interface Props extends HelperProps<ViewStyle>, ViewProps {

}

/**
 * @since 0.0.1
 */
export default function DateInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } = useContext(AttendanceContext);

    const orientation = useDeviceOrientation();

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

                <Tooltip 
                    dynamicStyle={AttendanceInputTooltipStyles.component}
                    iconStyle={{
                        ...AttendanceInputTooltipStyles.icon
                    }}
                    position="right"
                    buttonStyles={{
                        style: {
                            ...AttendanceInputTooltipStyles.button,
                        }
                    }}
                    textContainerStyles={{
                        ...AttendanceInputTooltipStyles.textContainerStyles,
                        maxWidth: orientation === "landscape" ? AttendanceInputTooltipStyles.maxWidthLandscape : AttendanceInputTooltipStyles.maxWidthPortrait,
                    }}
                >
                    <HelperText>Ausgegraute Werte sind Tage, an denen ein Prüfer bereits in einem anderen UB eingeplant ist.</HelperText>
                </Tooltip>
            </Flex>

            <DatePicker 
                date={currentAttendanceEntity.date} 
                setDate={(date) => updateCurrentAttendanceEntity(["date", date])}
                buttonStyles={AttendanceIndexStyles.defaultHelperButton}
                modalProps={{
                    validRange: {
                        disabledDates: invalidValues
                    }
                }}
                onConfirm={handleConfirm}         
            />
            
            {children}
        </HelperView>
    )
}
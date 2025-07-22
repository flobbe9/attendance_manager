import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { isSchoolYear, mightBecomeSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { isBlank } from "@/utils/utils";
import React, { Fragment, ReactNode, useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperInput from "../helpers/HelperInput";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";

interface Props extends HelperProps<ViewStyle>, ViewProps {

}

/**
 * @since 0.0.1
 */
export default function SchoolYearInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } = useContext(AttendanceContext);
    
    const [validValues, setValidValues] = useState<SchoolYear[]>([]);
    
    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .inputType("schoolYear")
        .build();

    const componentName = "SchoolYearInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        setValidValues(validator.getValidValues() as SchoolYear[]);
    }, [currentAttendanceEntity])

    /**
     * Attempt to fix `value` if invalid, then validate and possibly handle invalid `value`. Always throw error to prevent
     * default `HelperSelect` `setValue` call.
     *  
     * @param value put in by user
     */
    function handleChangeText(value: string): never {
        if (!mightBecomeSchoolYear(value)) {
            // try to use last digit
            value = getFixedInputValue(value);

            // case: still invalid, leave value unchanged
            if (!mightBecomeSchoolYear(value))
                throw new Error(`Invalid schoolYear ${value}`);
        }

        let errorMessage = validator.validate(value as SchoolYear);

        // case: invalid
        if (errorMessage != null) {
            handleInvalidAttendanceInput(value, errorMessage, "schoolYear");
            throw new Error(errorMessage);

        // case: valid
        } else
            resetInvalidAttendanceInputErrorStyles();

        // set value here, dont set it in helperinput
        handleSetValue(value);
        throw new Error();
    }

    function getFixedInputValue(invalidValue: string): string {
        if (isBlank(invalidValue))
            return invalidValue;

        if (invalidValue.length > 1) {
            const lastDigit = invalidValue.substring(invalidValue.length - 1, invalidValue.length);
            return mightBecomeSchoolYear(lastDigit) ? lastDigit : invalidValue;
        }

        return invalidValue;
    }

    function handleSetValue(value: string): void {
        updateCurrentAttendanceEntity(["schoolYear", value]);
    }

    return (
        <HelperView {...otherProps}>
            <Flex alignItems="center" style={{zIndex: 1}}>
                <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Jahrgang</HelperText>

                <AttendanceInputTooltip values={validValues} attendanceInputKey="schoolYear" validator={validator}/>
            </Flex>

            <HelperInput 
                value={currentAttendanceEntity.schoolYear ?? ""}
                setValue={handleSetValue}
                placeholder="5 - 13"
                keyboardType="numeric"
                containerStyles={AttendanceIndexStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                onChangeText={handleChangeText}
            />

            {children}
        </HelperView>
    )
}
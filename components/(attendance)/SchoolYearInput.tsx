import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { mightBecomeSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { MusicSchoolYearValidator } from "@/backend/validator/MusicSchoolYearValidator";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import HelperInput from "../helpers/HelperInput";
import HelperText from "../helpers/HelperText";
import { isBlank } from "@/utils/utils";
import { logDebug } from "@/utils/logUtils";
import Flex from "../helpers/Flex";
import AttendanceInputTooltip from "./AttendanceInputTooltip";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolYearInput({...props}: Props) {
    
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } = useContext(AttendanceContext);
    
    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .schoolSubject(currentAttendanceEntity.schoolSubject)
        .inputType("schoolYear")
        .build();

    const componentName = "SchoolYearInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    // TODO:
        // make save button 
            // validate required
            // validate schoolyear again since putting in 1 is possible now
            // reset error styles 


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

        updateCurrentAttendanceEntity("schoolYear", value);
    }


    return (
        <HelperView {...otherProps}>
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceStyles.heading}>Jahrgang</HelperText>
                <AttendanceInputTooltip attendanceInputKey="schoolYear" />
            </Flex>

            <HelperInput 
                value={currentAttendanceEntity.schoolYear}
                setValue={handleSetValue}
                placeholder="5 - 13"
                keyboardType="numeric"
                containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                onChangeText={handleChangeText}
            />

            {children}
        </HelperView>
    )
}
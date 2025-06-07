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
;


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolYearInput({...props}: Props) {
    
    const { hideSnackbar } = useContext(GlobalContext);
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput } = useContext(AttendanceContext);
    
    // TODO: 
        // validator 
        // .builder(current, all)
        // .subject
        // .build
            // returns right instance
    const validator = new MusicSchoolYearValidator(currentAttendanceEntity, savedAttendanceEntities);

    const componentName = "SchoolYearInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    // TODO:
        // make save button validate required
            // validate schoolyear again since putting in 1 is possible now
        // reset error styles 
            // on save
            // on valid input
            // on screen leave


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
                throw new Error(`Ungültiges Schuljahr ${value}`);
        }

        let errorMessage = validator.validate(value as SchoolYear);
        
        if (errorMessage != null) {
            handleInvalidAttendanceInput(value, errorMessage, "schoolYear");
            throw new Error(errorMessage);

        } else {
            // TODO: make this more generic?
                // reset error styles too
            hideSnackbar();
        }

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
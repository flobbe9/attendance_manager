import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { isSchoolYear, mightBecomeSchoolYear, SchoolYear } from "@/abstract/SchoolYear";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
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
import { log } from "@/utils/logUtils";
import { AbstractAttendanceInputValidator } from "@/backend/abstract/AbstractAttendanceInputValidator";
import { AbstractSchoolYearValidator } from "@/backend/abstract/AbstractSchoolYearValidator";
import { HistorySchoolYearValidator } from "@/backend/validator/HistorySchoolYearValidator";
import P from "../helpers/P";
import B from "../helpers/B";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolYearInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput, resetInvalidAttendanceInputErrorStyles } = useContext(AttendanceContext);
    
    const [tooltipValue, setTooltipValue] = useState<ReactNode>("");

    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .schoolSubject(currentAttendanceEntity.schoolSubject)
        .inputType("schoolYear")
        .build();

    const componentName = "SchoolYearInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        setTooltipValue(generateTooltipValue());
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

    function generateTooltipValue(): ReactNode {
        const values = validator.getValidValues();

        if (!values || !values.length) {
            if (!isSchoolYear(currentAttendanceEntity.schoolYear) && !currentAttendanceEntity.musicLessonTopic)
                return "Alle Werte haben ihre maximal Anzahl erreicht.";
         
            return "Keine Schuljahrauswahl möglich in Kombination mit den restlichen Werten.";
        }

        const validValuesReduced = ((validator.getValidValues() as string[]))
            .reduce((prev, cur) => `${prev}, ${cur}`);

        return (
            <HelperView>
                <B>Erlaubte Werte:</B>
                <HelperText>
                    {validValuesReduced}
                </HelperText>
            </HelperView>
        );
    }

    return (
        <HelperView {...otherProps}>
            <Flex alignItems="center" style={{zIndex: 1}}>
                <HelperText dynamicStyle={AttendanceStyles.heading}>Jahrgang</HelperText>

                <AttendanceInputTooltip attendanceInputKey="schoolYear">
                    {tooltipValue}
                </AttendanceInputTooltip>
            </Flex>

            <HelperInput 
                value={currentAttendanceEntity.schoolYear ?? ""}
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
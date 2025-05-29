import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import HelperInput from "../helpers/HelperInput";
import HelperText from "../helpers/HelperText";
;


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolYearInput({...props}: Props) {
    
    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "SchoolYearInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    return (
        <HelperView {...otherProps}>
            <HelperText dynamicStyle={AttendanceStyles.heading}>Jahrgang</HelperText>

            <HelperInput 
                value={currentAttendanceEntity.schoolYear}
                setValue={(value) => updateCurrentAttendanceEntity("schoolYear", value)}
                placeholder="5 - 13"
                keyboardType="numeric"
                containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
            />

            {children}
        </HelperView>
    )
}
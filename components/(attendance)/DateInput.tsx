import HelperProps from "@/abstract/HelperProps";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import DatePicker from "../helpers/DatePicker";
import HelperText from "../helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function DateInput({...props}: Props) {

    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const { allStyles: { mb_2 } } = useResponsiveStyles();

    const componentName = "DateInput";
    const { children, style, ...otherProps } = useHelperProps(props, componentName);

    return (
        <HelperView dynamicStyle={AttendanceStyles.inputContainer} style={{...style as object, ...mb_2}} {...otherProps}>
            <HelperText dynamicStyle={AttendanceStyles.heading}>Datum</HelperText>
            
            <DatePicker 
                date={currentAttendanceEntity.date} 
                setDate={(date) => updateCurrentAttendanceEntity("date", date)}
            />
            
            {children}
        </HelperView>
    )
}
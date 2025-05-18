import HelperProps from "@/abstract/HelperProps";
import { AttendanceContext } from "@/app/(attendance)/_layout";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import DatePicker from "../helpers/DatePicker";
import HelperText from "../helpers/HelperText";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function DateInput({...props}: Props) {

    const { currentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "DateInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    return (
        <HelperView dynamicStyle={AttendanceStyles.inputContainer} {...otherProps}>
            <HelperText dynamicStyle={AttendanceStyles.heading}>Datum</HelperText>
            
            <DatePicker date={currentAttendanceEntity.date} setDate={(date) => updateCurrentAttendanceEntity("date", date)} />
            
            {children}
        </HelperView>
    )
}
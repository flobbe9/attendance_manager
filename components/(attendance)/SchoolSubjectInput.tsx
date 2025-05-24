import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey, getSchoolSubjectKeyBySchoolSubject, SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import Tooltip from "../helpers/Tooltip";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolSubjectInput({...props}: Props) {

    const { currentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "SchoolSubjectInput";
    const { children, ...otherProps } = useDefaultProps(props, componentName);


    function handleSelect(value: SchoolSubject): void {

        updateCurrentAttendanceEntity("schoolSubject", value ? getSchoolSubjectKeyBySchoolSubject(value) : undefined);
    }
    

    return (
        <HelperSelect 
            options={SCHOOL_SUBJECTS}
            selectedOptions={getSchoolSubjectBySchoolSubjectKey(currentAttendanceEntity.schoolSubject)}
            setSelectedOptions={handleSelect}
            optionsContainerScroll={false}
            optionsContainerHeight={81}
            {...otherProps}
        >
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceStyles.heading}>Fach</HelperText>
                <Tooltip>
                    8 UBs pro Fach
                </Tooltip>
            </Flex>
            
            {children}
        </HelperSelect>
        
    )
}
import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey, getSchoolSubjectKeyBySchoolSubject, SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useContext, useEffect } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";
import { log } from "@/utils/logUtils";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolSubjectInput({...props}: Props) {

    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "SchoolSubjectInput";
    const { children, ...otherProps } = useDefaultProps(props, componentName);


    function handleSelect(value: SchoolSubject): void {

        updateCurrentAttendanceEntity("schoolSubject", value ? getSchoolSubjectKeyBySchoolSubject(value) : undefined);

        // TODO: 
            // switching to music will show topic which might cause an error
                // consider unsetting topic if music is selected from history
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

                <AttendanceInputTooltip attendanceInputKey="schoolSubject" />
            </Flex>
            
            {children}
        </HelperSelect>
        
    )
}
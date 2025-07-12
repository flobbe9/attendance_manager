import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey, getSchoolSubjectKeyBySchoolSubject, SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY } from "@/utils/constants";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import DontConfirmSchoolSubjectChangeContent from "./DontConfirmSchoolSubjectChangeContent";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { TRANSITION_DURATION } from "@/utils/styleConstants";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function SchoolSubjectInput({...props}: Props) {
    const { toast } = useContext(GlobalContext);
    const { dontConfirmSchoolSubjectChange, handleDontShowAgainDismiss } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const attendanceService = new AttendanceService();

    /** Triggered when invalid input error popup is dismissed.  */
    const [didDismissConfirmChangeToast, setDidDismissConfirmChangeToast] = useState(false);
    
    useEffect(() => {
        handleDontShowAgainDismiss(dontConfirmSchoolSubjectChange, [didDismissConfirmChangeToast, setDidDismissConfirmChangeToast], SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY);
    }, [didDismissConfirmChangeToast]);

    const componentName = "SchoolSubjectInput";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    function handleSelect(value: SchoolSubject): void {
        confirmChange(value);
    }

    function confirmChange(value: SchoolSubject): void {
        // case: did not change subject
        if (getSchoolSubjectKeyBySchoolSubject(value) === currentAttendanceEntity.schoolSubject)
            return;

        const handleConfirm = () => {
            updateCurrentAttendanceEntity(new Map([
                ["schoolSubject", value ? getSchoolSubjectKeyBySchoolSubject(value) : undefined],
                ["examinants", [] as any],
                ["musicLessonTopic", null],
                ["schoolYear", null],
                ["date", null]
            ]));
        }

        // selected not to confirm or don't have a previous subject (therefore no subject "change")
        if (!dontConfirmSchoolSubjectChange && attendanceService.isSelectInputFilledOut(currentAttendanceEntity.schoolSubject)) {
            toast(
                <DontConfirmSchoolSubjectChangeContent />,
                {
                    onConfirm: handleConfirm,
                    onDismiss: () => setDidDismissConfirmChangeToast(true)
                }
            );
            
        } else
            setTimeout(() => {
                handleConfirm();
            }, TRANSITION_DURATION); // wait for select drop down animation to finish
    }
    
    return (
        <HelperSelect 
            options={SCHOOL_SUBJECTS}
            selectedOptions={getSchoolSubjectBySchoolSubjectKey(currentAttendanceEntity.schoolSubject)}
            setSelectedOptions={handleSelect}
            optionsContainerScroll={!currentAttendanceEntity.schoolSubject} // should be position relative while bottom most element in scrollview, but absolute while not
            optionsContainerHeight={81}
            {...otherProps}
        >
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceStyles.heading}>Fach</HelperText>
            </Flex>
            
            {children}
        </HelperSelect>
    )
}
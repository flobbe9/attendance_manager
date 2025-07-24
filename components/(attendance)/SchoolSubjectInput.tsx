import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey, getSchoolSubjectKeyBySchoolSubject, SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useDontShowAgainStates } from "@/hooks/useDontShowAgainStates";
import React, { useContext, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import DontConfirmSchoolSubjectChangeContent from "./DontConfirmSchoolSubjectChangeContent";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function SchoolSubjectInput({...props}: Props) {
    const { toast } = useContext(GlobalContext);
    const { dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const attendanceService = new AttendanceService();

    const { setDidConfirm, setDidDismiss } = useDontShowAgainStates([dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange], "popups.dontConfirmSchoolSubjectChnage");

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
                ["examinants", [{role: getSchoolSubjectKeyBySchoolSubject(value)}] as any], // preselct matching examinant
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
                    onConfirm: () => {
                        setDidConfirm(true);
                        handleConfirm();
                    },
                    onDismiss: () => setDidDismiss(true)
                }
            );
            
        } else
            setTimeout(() => {
                handleConfirm();
            }, 100); // wait for select drop down animation to finish
    }
    
    return (
        <HelperSelect 
            options={SCHOOL_SUBJECTS}
            selectedOptions={getSchoolSubjectBySchoolSubjectKey(currentAttendanceEntity.schoolSubject)}
            setSelectedOptions={handleSelect}
            optionsContainerScroll={!currentAttendanceEntity.schoolSubject} // should be position relative while bottom most element in scrollview, but absolute while not
            noSelectionLabel={currentAttendanceEntity.schoolSubject ? null : "<Noch kein Fach...>"}
            selectionButtonStyles={AttendanceIndexStyles.defaultHelperButton}
            {...otherProps}
        >
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Fach</HelperText>
            </Flex>
            
            {children}
        </HelperSelect>
    )
}
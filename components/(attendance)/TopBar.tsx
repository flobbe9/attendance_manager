import HelperProps from "@/abstract/HelperProps";
import { TopBarStyles } from "@/assets/styles/TopBarStyles";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { logTrace } from "@/utils/logUtils";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import Flex from "../helpers/Flex";
import HelperButton from "../helpers/HelperButton";
import HelperText from "../helpers/HelperText";
import ToastDimissFooter from "../ToastDismissFooter";
import { FONT_SIZE, FONT_SIZE_SMALLER, TOAST_ERROR_OUTER_STYLES } from "@/utils/styleConstants";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function TopBar({...props}: Props) {

    const { allStyles: { pe_2, mt_5 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();

    const { popup, snackbar, toast, hideToast } = useContext(GlobalContext);
    const { modified, updateLastSavedAttendanceEntity, currentAttendanceEntity, setCurrentAttendanceEntity } = useContext(AttendanceContext);
    
    const { attendanceRespository } = useAttendanceRepository();

    const componentName = "TopBar";
    const { children, ...otherProps } = useHelperProps(props, componentName, TopBarStyles.component);

    
    // TODO: 
        // save button should not be enabled while required fields are missing (simply do "isValid"?)
    async function handleSavePress(): Promise<void> {

        // validate empty values to prevent at least sql exceptions

        // validate all logic?

        // if invalid
            // notify
        // else

        const attendanceEntityResult = await attendanceRespository.persistCascade(currentAttendanceEntity);
        if (!attendanceEntityResult)
            return toastError();

        logTrace("save attendance result: ", attendanceEntityResult);

        // update states
        setCurrentAttendanceEntity(attendanceEntityResult);
        updateLastSavedAttendanceEntity(attendanceEntityResult);

        // notify success
        setTimeout(() => {
            popup(
                "Gespeichert",
                {
                    icon: <FontAwesome name="save" />
                }
            );
        }, 500); // wait for states to update to prevent popup flash
    }


    function toastError(): void {

        const content = (
            <HelperText
                style={{fontSize: FONT_SIZE_SMALLER}}
            >
                Unerwarteter Fehler beim Speichern. Keine der letzten Änderungen wurde gespeichert. Versuche es nochmal oder kontaktiere den Support.
            </HelperText>
        );

        const footer = (
            <ToastDimissFooter 
                buttonStyles={{
                    backgroundColor: "white"
                }} 
                style={{...mt_5}} 
                onDimiss={hideToast} 
            />
        );

        toast(
            content,
            {
                outerStyle: {...TOAST_ERROR_OUTER_STYLES},
                defaultFooter: false,
                children: footer
            }
        )
    }


    return (
        <Flex justifyContent="flex-end" {...otherProps}>
            {/* Save button */}
            <HelperButton dynamicStyle={TopBarStyles.saveButton} onPress={handleSavePress} disabled={!modified}> 
                <FontAwesome 
                    name="save"
                    style={{
                        ...TopBarStyles.saveButtonChildren.default, 
                        ...pr({pe_2})
                    }} 
                />
                <HelperText dynamicStyle={TopBarStyles.saveButtonChildren}>Save</HelperText>
            </HelperButton>
        </Flex>
    )
}
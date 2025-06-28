import HelperProps from "@/abstract/HelperProps";
import { TopBarStyles } from "@/assets/styles/TopBarStyles";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { logTrace } from "@/utils/logUtils";
import { FONT_SIZE, FONT_SIZE_SMALLER, TOAST_ERROR_OUTER_STYLES } from "@/utils/styleConstants";
import { isNumberFalsy } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import B from "../helpers/B";
import Br from "../helpers/Br";
import Flex from "../helpers/Flex";
import HelperButton from "../helpers/HelperButton";
import HelperText from "../helpers/HelperText";
import HelperView from "../helpers/HelperView";
import ToastDimissFooter from "../ToastDismissFooter";
import { eq } from "drizzle-orm";
import { Attendance_Table } from "@/backend/DbSchema";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function TopBar({...props}: Props) {

    const { allStyles: { mt_5, col_6 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();

    const { popup, toast, hideToast } = useContext(GlobalContext);
    const { 
        modified, 
        updateLastSavedAttendanceEntity, 
        currentAttendanceEntity, 
        setCurrentAttendanceEntity, 
    } = useContext(AttendanceContext);
    
    const { attendanceRespository } = useAttendanceRepository();

    const { navigate } = useRouter();

    const componentName = "TopBar";
    const { children, ...otherProps } = useHelperProps(props, componentName, TopBarStyles.component);

    
    // TODO: 
        // save button should not be enabled while required fields are missing (simply do "isValid"?)
        // validate required
        // validate schoolyear again since putting in 1 is possible now
        // reset error styles 
    async function handleSavePress(): Promise<void> {
        // validate empty values to prevent at least sql exceptions

        // if invalid
            // notify
        // else

        const attendanceEntityResult = await attendanceRespository.persistCascade(currentAttendanceEntity);
        if (!attendanceEntityResult)
            return toastError("Unerwarteter Fehler beim Speichern", "Keine der letzten Änderungen wurde gespeichert. Versuche es nochmal oder kontaktiere den Support.");

        logTrace("save attendance result: ", attendanceEntityResult);

        // update states
        setCurrentAttendanceEntity(attendanceEntityResult);
        updateLastSavedAttendanceEntity(attendanceEntityResult);

        // notify success
        setTimeout(() => {
            popup(
                "UB Gespeichert",
                {
                    icon: <FontAwesome name="save" />
                }
            );
        }, 500); // wait for states to update to prevent popup flash
    }

    function handleDeletePress(): void {
        if (isNumberFalsy(currentAttendanceEntity.id))
            return;

        toast(
            <HelperView>
                <B>UB löschen</B>
                <Br />

                <HelperText>Bist du sicher? Der UB kann nicht wiederhergestellt werden!</HelperText>
            </HelperView>,
            {
                onConfirm: async () => {
                    const result = await attendanceRespository.delete(eq(Attendance_Table.id, currentAttendanceEntity.id));

                    if (result === null) {
                        toastError("Unerwarteter Fehler beim Löschen", "Der Unterrichtsbesuch wurde nicht gelöscht. Versuche es nochmal oder kontaktiere den Support.");
                        return;   
                    }

                    navigate("../");

                    popup("UB gelöscht", { icon: <FontAwesome name="trash" />});
                }     
            }
        )
    }

    function toastError(heading: string, errorMessage: string): void {
        const content = (
            <HelperView>
                <B>{heading}</B>
                <Br />

                <HelperText
                    style={{fontSize: FONT_SIZE_SMALLER}}
                >
                    {errorMessage}
                </HelperText>
            </HelperView>
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
        <Flex flexWrap="nowrap" {...otherProps}>
            <Flex justifyContent="flex-start" style={{...pr({col_6})}}>
                {/* Delete button */}
                <HelperButton dynamicStyle={TopBarStyles.deleteButton} onPress={handleDeletePress} disabled={isNumberFalsy(currentAttendanceEntity.id)}> 
                    <FontAwesome 
                        name="trash"
                        size={FONT_SIZE}
                    />
                </HelperButton>
            </Flex>

            <Flex justifyContent="flex-end" style={{...pr({col_6})}}>
                {/* Save button */}
                <HelperButton dynamicStyle={TopBarStyles.saveButton} onPress={handleSavePress} disabled={!modified}> 
                    <FontAwesome 
                        name="save"
                        style={{
                            ...TopBarStyles.saveButtonChildren.default, 
                        }} 
                        size={FONT_SIZE}
                    />
                    {/* <HelperText dynamicStyle={TopBarStyles.saveButtonChildren}>Save</HelperText> */}
                </HelperButton>
            </Flex>
        </Flex>
    )
}
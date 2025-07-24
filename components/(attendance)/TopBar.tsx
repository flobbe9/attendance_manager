import HelperProps from "@/abstract/HelperProps";
import { isSchoolYear } from "@/abstract/SchoolYear";
import HelperStyles from "@/assets/styles/helperStyles";
import { ToastDefaultFooterStyles } from "@/assets/styles/ToastDefaultFooterStyles";
import { TopBarStyles } from "@/assets/styles/TopBarStyles";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { logTrace } from "@/utils/logUtils";
import { FONT_SIZE_LARGER, FONT_SIZE_SMALLER, TOAST_ERROR_OUTER_STYLES } from "@/utils/styleConstants";
import { isBlank, isNumberFalsy } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import React, { Fragment, useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { GlobalContext } from "../context/GlobalContextProvider";
import B from "../helpers/B";
import Br from "../helpers/Br";
import Flex from "../helpers/Flex";
import HelperButton from "../helpers/HelperButton";
import HelperText from "../helpers/HelperText";
import HelperView from "../helpers/HelperView";
import ToastDimissFooter from "../ToastDismissFooter";
import { Attendance_Table } from "@/backend/schemas/AttendanceSchema";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function TopBar({...props}: Props) {
    const { allStyles: { mt_5, mt_3 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();

    const { popup, toast, hideToast } = useContext(GlobalContext);
    const {
        updateSavedAttendanceEntities
    } = useContext(GlobalAttendanceContext);
    const { 
        isCurrentAttendanceEntityModified, 
        updateLastSavedAttendanceEntity, 
        currentAttendanceEntity, 
        setCurrentAttendanceEntity, 
        resetInvalidAttendanceInputErrorStyles
    } = useContext(AttendanceContext);

    const { attendanceRespository } = useAttendanceRepository();
    const attendanceService = new AttendanceService();

    const { navigate } = useRouter();

    const componentName = "TopBar";
    const { children, ...otherProps } = useHelperProps(props, componentName, TopBarStyles.component);

    async function handleSavePress(): Promise<void> {
        let errorMessage = null;
        if ((errorMessage = validateBeforeSave()) !== null) {
            toast(
                <Fragment>
                    <B>Invalider UB</B>
                    <Br />

                    <HelperText>{errorMessage}</HelperText>
                </Fragment>,
                {
                    defaultFooter: false,
                    // custom footer
                    children: (
                        <Flex style={{ ...HelperStyles.fullWidth, ...mt_3 }} justifyContent="flex-end">
                            <HelperButton dynamicStyle={ToastDefaultFooterStyles.button} onPress={hideToast}>
                                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Cancel</HelperText>
                            </HelperButton>
                        </Flex>
                    ),
                }
            );
            return;
        }

        const attendanceEntityResult = await attendanceRespository.persistCascade(currentAttendanceEntity);
        if (!attendanceEntityResult)
            return toastError(
                "Unerwarteter Fehler beim Speichern",
                "Keine der letzten Änderungen wurde gespeichert. Versuche es nochmal oder kontaktiere den Support."
            );

        logTrace("save attendance result: ", attendanceEntityResult);

        // update states
        setCurrentAttendanceEntity(attendanceEntityResult);
        updateLastSavedAttendanceEntity(attendanceEntityResult);
        updateSavedAttendanceEntities();

        resetInvalidAttendanceInputErrorStyles();

        // notify success
        popup("UB Gespeichert", {
            icon: <FontAwesome name="save" />,
        });
    }

    /**
     * Make sure that no problematic input values are saved, e.g. a malformed schoolYear or notNull values.
     *
     * @returns an error  message or `null` if valid
     */
    function validateBeforeSave(): string | null {
        let errorMessage: string = null;

        // allow blank schoolyear but not a malformed one (e.g. "1")
        if (!isBlank(currentAttendanceEntity.schoolYear) && !isSchoolYear(currentAttendanceEntity.schoolYear))
            errorMessage = "Bevor du speicherst, gib einen validen Jahrgang an oder lasse das Feld leer.";
        else if (!attendanceService.isSelectInputFilledOut(currentAttendanceEntity.schoolSubject))
            errorMessage = "Bevor du speicherst, gib ein Fach an.";

        return errorMessage;
    }

    function handleDeletePress(): void {
        if (isNumberFalsy(currentAttendanceEntity.id)) return;

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
                        toastError(
                            "Unerwarteter Fehler beim Löschen",
                            "Der Unterrichtsbesuch wurde nicht gelöscht. Versuche es nochmal oder kontaktiere den Support."
                        );
                        return;
                    }

                    navigate("../");

                    popup("UB gelöscht", { icon: <FontAwesome name="trash" /> });
                },
            }
        );
    }

    function toastError(heading: string, errorMessage: string): void {
        const content = (
            <HelperView>
                <B>{heading}</B>
                <Br />

                <HelperText style={{ fontSize: FONT_SIZE_SMALLER }}>{errorMessage}</HelperText>
            </HelperView>
        );

        const footer = (
            <ToastDimissFooter
                buttonStyles={{
                    backgroundColor: "white",
                }}
                style={{ ...mt_5 }}
                onDimiss={hideToast}
            />
        );

        toast(content, {
            outerStyle: { ...TOAST_ERROR_OUTER_STYLES },
            defaultFooter: false,
            children: footer,
        });
    }

    return (
        // NOTE: dont use onPress prop since it somehow does not work with sticky header
        <Flex justifyContent="space-between" {...otherProps}>
            {/* Delete button */}
            <HelperButton dynamicStyle={TopBarStyles.deleteButton} onTouchEnd={handleDeletePress} disabled={isNumberFalsy(currentAttendanceEntity.id)}> 
                <FontAwesome 
                    name="trash"
                    size={FONT_SIZE_LARGER}
                />
            </HelperButton>

            {/* Save button */}
            <HelperButton 
                dynamicStyle={TopBarStyles.saveButton} 
                disabled={!isCurrentAttendanceEntityModified}
                onTouchEnd={handleSavePress} 
            > 
                <FontAwesome 
                    name="save"
                    style={{
                        ...TopBarStyles.saveButtonChildren.default,
                    }}
                    size={FONT_SIZE_LARGER}
                />
            </HelperButton>
        </Flex>
    );
}

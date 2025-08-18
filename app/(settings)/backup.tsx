import { combineDynamicStyles } from "@/abstract/DynamicStyle";
import { PrettyError } from "@/abstract/PrettyError";
import { backupStyles } from "@/assets/styles/backupStyles";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import B from "@/components/helpers/B";
import Br from "@/components/helpers/Br";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { GlobalToastProps } from "@/components/Toast";
import ToastDefaultFooter from "@/components/ToastDefaultFooter";
import { useAppVersionInfo } from "@/hooks/useAppVersion";
import { useDbBackup } from "@/hooks/useDbBackup";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { ENV } from "@/utils/constants";
import { logError } from "@/utils/logUtils";
import { formatDateGermanIncludeTime, redirectToStore } from "@/utils/projectUtils";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";

/**
 * @since latest
 */
export default function backup() {
    const { prs } = useResponsiveStyles();
    const { snackbar, toast, hideToast } = useContext(GlobalContext);
    const { loadManualBackupLastLoaded, writeBackupToDevice, persistBackupFromDevice } = useDbBackup();
    const { canUpdateAppVersion } = useAppVersionInfo();

    const [manualBackupLastLoaded, setManualBackupLastLoaded] = useState("");

    const errorToastProps: Omit<GlobalToastProps, 'visible' | 'content'> = {
        sevirity: 'error',
        defaultFooter: false,
        children: <ToastDefaultFooter onCancel={hideToast} onConfirm={undefined} hideConfirmButton />,
    }

    useEffect(() => {
        updateManualBackupLastLoaded();
    }, []);

    async function updateManualBackupLastLoaded() {
        setManualBackupLastLoaded(formatDateGermanIncludeTime(await loadManualBackupLastLoaded()));
    }

    async function handlePersistBackupPress(): Promise<void> {
        const handleConfirm = async () => {
            try {
                await persistBackupFromDevice();
                snackbar("Backup erfolgreich aufgespielt", "success");
            } catch (e) {
                if (e instanceof PrettyError) {
                    // case: canceled file picker
                    if (e.statusCode === 304) return;

                    toast(
                        <HelperView>
                            <B style={{...prs("mb_2")}}>Backupdatei {e.statusCode === 400 ? 'fehlerhaft' : 'inkompatibel'}</B>
                            <HelperText>{e.prettyMessage}</HelperText>
                        </HelperView>, 
                        errorToastProps
                    );
                } else {
                    toast(
                        <HelperView>
                            <B style={{...prs("mb_2")}}>Unerwarteter Fehler</B>
                            <HelperText>Das Backup konnte nicht erstellt werden. Keine deiner Daten wurden überschrieben. Versuche es erneut oder kontatiere den Support.</HelperText>
                        </HelperView>, 
                    );
                }

                logError(e);
            }
        };

        toast(
            <HelperView>
                <FontAwesome style={{ ...prs("mb_2"), ...backupStyles.warnIcon }} name="exclamation" />
                <HelperText>UB Daten auf diesem Gerät mit einem Backup überschreiben?</HelperText>
                <HelperText>Dieser Vorgang kann nicht rückgängig gemacht werden!</HelperText>
            </HelperView>,
            {
                onConfirm: handleConfirm,
            }
        );
    }

    async function handleWriteBackupPress(): Promise<void> {
        try {
            await writeBackupToDevice();
        } catch (e) {
            logError(e);

            if (e instanceof PrettyError) {
                toast(
                    <HelperView>
                        <B style={{...prs("mb_2")}}>Das hat nicht geklappt...</B>
                        <HelperText>Das Backup konnte nicht erstellt werden. Versuche es erneut oder kontatiere den Support.</HelperText>
                    </HelperView>, 
                    errorToastProps
                );
            } else {
                toast(
                    <HelperView>
                        <B style={{...prs("mb_2")}}>Unerwarteter Fehler</B>
                        <HelperText>Das Backup konnte nicht erstellt werden. Versuche es erneut oder kontatiere den Support.</HelperText>
                    </HelperView>, 
                    errorToastProps
                );
            }
        }
    }

    return (
        <ScreenWrapper style={{ padding: GLOBAL_SCREEN_PADDING }}>
            {/* Write backup */}
            <HelperText>
                Lädt eine Datei mit allen UB Informationen herunter. App-Einstellungen sind darin nicht
                enthalten.
            </HelperText>
            <HelperButton
                onPress={() => handleWriteBackupPress()}
                style={{ ...prs("mt_2") }}
                dynamicStyle={backupStyles.button}
            >
                <FontAwesome
                    name="download"
                    style={{ ...prs("me_1"), ...backupStyles.buttonContent.default }}
                />
                <HelperText dynamicStyle={backupStyles.buttonContent}>Backup erstellen</HelperText>
            </HelperButton>

            {/* Persist backup */}
            <HelperText style={{ ...prs("mt_4") }}>
                Überschreibt alle UBs auf diesem Gerät mit denen aus der Backupdatei. Dieser Vorgang kann
                nicht rückgängig gemacht werden!
            </HelperText>
            <HelperButton
                onPress={() => handlePersistBackupPress()}
                style={{ ...prs("my_2") }}
                dynamicStyle={combineDynamicStyles(backupStyles.button, backupStyles.buttonWarn)}
            >
                <FontAwesome5 name="sync" style={{ ...prs("me_1"), ...backupStyles.buttonContent.default }} />
                <HelperText dynamicStyle={backupStyles.buttonContent}>Backup aufspielen</HelperText>
            </HelperButton>

            <HelperText>Letztes Backup aufgespielt: {manualBackupLastLoaded}</HelperText>

            {/* Get latest Version */}
            <HelperView rendered={canUpdateAppVersion}>
                <HelperText style={{ ...prs("mt_6") }}>
                    Wenn dein Backup nicht kompatibel mit dieser Appversion ist, aktualisiere die App auf
                    diesem Gerät oder auf dem Gerät, auf dem du das Backup erstellt hast.{" "}
                    <Link href="/appInfo" style={{ ...backupStyles.link }}>
                        Appversion anzeigen
                    </Link>
                </HelperText>
                <HelperButton
                    dynamicStyle={backupStyles.button}
                    style={{ ...prs("mt_2") }}
                    onPress={redirectToStore}
                >
                    <FontAwesome
                        name="external-link-square"
                        style={{ ...prs("me_1"), ...backupStyles.buttonContent.default }}
                    />
                    <HelperText dynamicStyle={backupStyles.buttonContent}>
                        Neueste App Version herunterladen
                    </HelperText>
                </HelperButton>
            </HelperView>
        </ScreenWrapper>
    );
}

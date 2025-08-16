import { PrettyError } from "@/abstract/PrettyError";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import Br from "@/components/helpers/Br";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useDbBackup } from "@/hooks/useDbBackup";
import { logError } from "@/utils/logUtils";
import { formatDateGermanIncludeTime } from "@/utils/projectUtils";
import { useContext } from "react";

/**
 * @since latest
 */
export default function backup() {
    const { snackbar } = useContext(GlobalContext);
    const { loadManualBackupLastLoaded, writeBackupToDevice, persistBackupFromDevice } = useDbBackup();

    // TODO: handle need to update version, add store link
    async function handlePersistBackupPress(): Promise<void> {
        try {
            await persistBackupFromDevice();
            snackbar("Backup erfolgreich aufgespielt", 'success');

        } catch (e) {
            if (e instanceof PrettyError) {
                // case: canceled file picker
                if (e.statusCode === 304)
                    return;

                e.handle(() => snackbar(e.prettyMessage, 'error'));
            } else {
                logError(e);
                snackbar("TODO", 'error');
            }
        }
    }

    async function handleWriteBackupPress(): Promise<void> {
        // TODO: confirm toast?
        try {
            await writeBackupToDevice();

        } catch (e) {
            if (e instanceof PrettyError) {
                e.handle(() => snackbar(e.prettyMessage, 'error'));
            } else {
                logError(e);
                snackbar("TODO", 'error');
            }
        }
    }

    async function formatManualBackupLastLoaded(): Promise<string> {
        return formatDateGermanIncludeTime(await loadManualBackupLastLoaded());
    }

    return (
        <ScreenWrapper>
            <HelperText>Explanation</HelperText>

            <HelperButton
                onPress={handleWriteBackupPress}
            >
                Backup herunterladen
            </HelperButton>
            <HelperText>Lädt eine Datei mit allen relevanten UBs herunter.</HelperText>
            <Br />

            <HelperButton
                onPress={handlePersistBackupPress}
            >
                Backup aufspielen
            </HelperButton>
            <HelperText>Überschreibt alle UBs mit denen aus der Backupdatei. Dieser Vorgang kann nicht rückgängig gemacht werden!</HelperText>
            <HelperText>Letztes Backup aufgespielt: {formatManualBackupLastLoaded()}</HelperText>
        </ScreenWrapper>
    );
}

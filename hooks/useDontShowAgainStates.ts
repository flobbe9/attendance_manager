import {GlobalContext} from "@/components/context/GlobalContextProvider";
import {useContext, useEffect, useState} from "react";
import {useSettingsRepository} from "./repositories/useSettingsRepository";

/**
 * Specifically for memorizing popup like "dont show again" choices. Will create / update a db setting and notify user.
 *
 * Also handles the dontShowAgainState properly sothat only confirming the popup will trigger a db update and dismiss will reset the user's choice.
 *
 * @param dontShowAgainState should reflect the user's current choice (e.g. checkbox state)
 * @param settingsKey for updated the settings entity entry. Should be a boolean entry
 * @returns setters for confirm and dismiss states. Related to the popup.
 * @since 0.1.0
 */
export function useDontShowAgainStates(
    dontShowAgainState: [boolean, (dontShowAgain: boolean) => void],
    settingsKey: string
) {
    /** Refers to the boolean value beeing confirmed */
    const [didConfirm, setDidConfirm] = useState(false);
    /** Refers to the message with the boolean value beeing dismissed */
    const [didDismiss, setDidDismiss] = useState(false);
    const [dontShowAgain, setDontShowAgain] = dontShowAgainState;

    const {snackbar} = useContext(GlobalContext);

    const {settingsRepository} = useSettingsRepository();

    useEffect(() => {
        initializeDontShowAgain();
    }, []);

    useEffect(() => {
        if (didConfirm) handleDontShowAgainConfirm();
    }, [didConfirm]);

    useEffect(() => {
        if (didDismiss) {
            if (!didConfirm) setDontShowAgain(false);

            setDidDismiss(false);
        }
    }, [didDismiss]);

    async function initializeDontShowAgain(): Promise<void> {
        setDontShowAgain(await settingsRepository.loadBooleanSetting(settingsKey));
    }

    /**
     * Save setting as "true", notify user and reset `didConfirm` state.
     */
    async function handleDontShowAgainConfirm(): Promise<void> {
        if (!dontShowAgain) return;

        await settingsRepository.updateValue(settingsKey, "true");

        snackbar(
            "Präferenz gespeichert. Du kannst deine Auswahl unter 'Einstellungen' jederzeit ändern."
        ),
            setDidConfirm(false);
    }

    return {
        setDidConfirm,
        setDidDismiss,
    };
}

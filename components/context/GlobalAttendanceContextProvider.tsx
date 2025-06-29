import { AttendanceEntity } from "@/backend/DbSchema";
import { useSettingsRepository } from "@/hooks/repositories/useSettingsRepository";
import { SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY, SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY } from "@/utils/constants";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContextProvider";

/**
 * Context for the app index.
 * 
 * @since 0.0.1
 */
export default function GlobalAttendanceContextProvider({children}) {
    const { snackbar } = useContext(GlobalContext);

    const [attendanceEntities, setAttendanceEntities] = useState<AttendanceEntity[]>([]);
    /** 
     * The attendance entities' id currently beeing edited. Only meant for initializing the `currentAttendanceEntity`. 
     * Set to 0 or negative num to indicate to initialize a new attendanceEntity
     */
    const [currentAttendanceEntityId, setCurrentAttendanceEntityId] = useState<number | null>(null);

    const [dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup] = useState(false);
    const [dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange] = useState(false);

    const { settingsRepository } = useSettingsRepository();

    const context = {
        currentAttendanceEntityId, setCurrentAttendanceEntityId,
        savedAttendanceEntities: attendanceEntities, setSavedAttendanceEntities: setAttendanceEntities,
        dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup,
        dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange,

        handleDontShowAgainDismiss
    }

    useEffect(() => {
        initializedontShowInvalidInputErrorPopupState();
    }, []);

    async function initializedontShowInvalidInputErrorPopupState(): Promise<void> {
        setDontShowInvalidInputErrorPopup(await settingsRepository.loadBooleanSetting(SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY));
        setDontConfirmSchoolSubjectChange(await settingsRepository.loadBooleanSetting(SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY));
    }
    
    /**
     * Use this to save a "dont-show-again" value. Will set the settings value for `settingsKey` to "true" if both 
     * `checked` and `didDismiss` are `true`.
     * 
     * Resets `didDismiss` state.
     * 
     * @param checked whether the "dont-show-again" checkbox is checked
     * @param didDismiss whether the popup or whatever container of the checkbox has been dismissed 
     * @param settingsKey db settings key for updating the setting entry
     */
    async function handleDontShowAgainDismiss(checked: boolean, didDismissState: [boolean, Dispatch<SetStateAction<boolean>>], settingsKey: string): Promise<void> {
        const [didDismiss, setDidDismiss] = didDismissState;
        if (checked && didDismiss) {
            await settingsRepository.updateValue(settingsKey, "true");
            setTimeout(() => 
                snackbar("Präferenz gespeichert. Du kannst deine Auswahl unter 'Einstellungen' jederzeit ändern."), 
            200);
        }
    
        // reset dismiss state
        setDidDismiss(false);
    }
    
    return (
        <GlobalAttendanceContext.Provider value={context}>
            {children}
        </GlobalAttendanceContext.Provider>
    )
}


export const GlobalAttendanceContext = createContext({
    currentAttendanceEntityId: null as number | null, 
    setCurrentAttendanceEntityId: (currentId: number | null): void => {},
    savedAttendanceEntities: [] as AttendanceEntity[],
    setSavedAttendanceEntities: (savedAttendanceEntities: AttendanceEntity[]): void => {},

    dontShowInvalidInputErrorPopup: false as boolean, 
    setDontShowInvalidInputErrorPopup: (isShow: boolean): void => {},
    
    dontConfirmSchoolSubjectChange: false as boolean, 
    setDontConfirmSchoolSubjectChange: (isConfirm: boolean): void => {},

    handleDontShowAgainDismiss: (checked: boolean, didDismissState: [boolean, Dispatch<SetStateAction<boolean>>], settingsKey: string): void => {}
});
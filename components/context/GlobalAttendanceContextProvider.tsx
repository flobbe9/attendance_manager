import { AttendanceEntity } from "@/backend/DbSchema";
import { useSettingsRepository } from "@/hooks/repositories/useSettingsRepository";
import { createContext, useEffect, useState } from "react";


/**
 * Context for the app index.
 * 
 * @since 0.0.1
 */
export default function GlobalAttendanceContextProvider({children}) {

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
        dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange
    }

    useEffect(() => {
        initializedontShowInvalidInputErrorPopupState();
    }, []);


    async function initializedontShowInvalidInputErrorPopupState(): Promise<void> {
        setDontShowInvalidInputErrorPopup(await settingsRepository.getDontShowAttendanceValidationErrorPopup());
        setDontConfirmSchoolSubjectChange(await settingsRepository.getDontConfirmSchoolSubjectChange());
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
    setDontConfirmSchoolSubjectChange: (isConfirm: boolean): void => {}
});
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceRepository } from "@/backend/repositories/AttendanceRepository";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { createContext, useState } from "react";

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
    const [dontConfirmAttendanceScreenLeave, setDontConfirmAttendanceScreenLeave] = useState(false);

    const { attendanceRespository } = useAttendanceRepository();

    const context = {
        currentAttendanceEntityId, setCurrentAttendanceEntityId,
        savedAttendanceEntities: attendanceEntities, setSavedAttendanceEntities: setAttendanceEntities,
        updateSavedAttendanceEntities,

        dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup,
        dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange,
        dontConfirmAttendanceScreenLeave, setDontConfirmAttendanceScreenLeave,
    }
        
    async function loadAttendanceEntities(): Promise<AttendanceEntity[]> {
        return await attendanceRespository.selectCascade();
    }
    
    async function updateSavedAttendanceEntities(): Promise<void> {
        setAttendanceEntities(await loadAttendanceEntities() ?? []);
    }
    
    return (
        <GlobalAttendanceContext.Provider value={context}>
            {children}
        </GlobalAttendanceContext.Provider>
    );
}

export const GlobalAttendanceContext = createContext({
    currentAttendanceEntityId: null as number | null,
    setCurrentAttendanceEntityId: (currentId: number | null): void => {},
    savedAttendanceEntities: [] as AttendanceEntity[],
    setSavedAttendanceEntities: (savedAttendanceEntities: AttendanceEntity[]): void => {},

    updateSavedAttendanceEntities: async (): Promise<void> => {},

    dontShowInvalidInputErrorPopup: false as boolean, 
    setDontShowInvalidInputErrorPopup: (dontShow: boolean): void => {},

    dontConfirmSchoolSubjectChange: false as boolean,
    setDontConfirmSchoolSubjectChange: (dontConfirm: boolean): void => {},

    dontConfirmAttendanceScreenLeave: false as boolean,
    setDontConfirmAttendanceScreenLeave: (dontConfirm: boolean): void => {},
});

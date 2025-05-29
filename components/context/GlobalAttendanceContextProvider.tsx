import { AttendanceEntity } from "@/backend/DbSchema";
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

    const context = {
        currentAttendanceEntityId, setCurrentAttendanceEntityId,
        allAttendanceEntities: attendanceEntities, setAllAttendanceEntities: setAttendanceEntities
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
    allAttendanceEntities: [] as AttendanceEntity[],
    setAllAttendanceEntities: (allAttendanceEntities: AttendanceEntity[]): void => {}
});
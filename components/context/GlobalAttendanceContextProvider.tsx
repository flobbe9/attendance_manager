import { AttendanceEntity } from "@/backend/DbSchema";
import { createContext, useState } from "react";


/**
 * Context for the app index.
 * 
 * @since 0.0.1
 */
export default function GlobalAttendanceContextProvider({children}) {

    const [attendanceEntities, setAttendanceEntities] = useState<AttendanceEntity[]>([]);
    /** The attendance entity currently beeing edited. `undefined` if not on edit screen */
    const [currentAttendanceEntity, setCurrentAttendanceEntity] = useState<AttendanceEntity | undefined>({
        schoolSubject: undefined,
        schoolclassMode: {
            mode: "ownClass"
        },
        examinants: [],
        schoolYear: undefined
    });
    

    const context = {
        currentAttendanceEntity, setCurrentAttendanceEntity,
        allAttendanceEntities: attendanceEntities, setAllAttendanceEntities: setAttendanceEntities
    }
    
    return (
        <GlobalAttendanceContext.Provider value={context}>
            {children}
        </GlobalAttendanceContext.Provider>
    )
}


export const GlobalAttendanceContext = createContext({
    currentAttendanceEntity: {} as AttendanceEntity | undefined,
    setCurrentAttendanceEntity: (currentAttendanceEntity: AttendanceEntity): void => {},
    allAttendanceEntities: [] as AttendanceEntity[],
    setAllAttendanceEntities: (allAttendanceEntities: AttendanceEntity[]): void => {}
});
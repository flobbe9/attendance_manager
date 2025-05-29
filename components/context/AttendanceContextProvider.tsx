import { AttendanceEntity } from "@/backend/DbSchema";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { cloneObj } from "@/utils/utils";
import { createContext, useState } from "react";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";


/**
 * Context available to all attendance edit sepcific screens of /(attendance).
 * 
 * @param children mandatory 
 * @since 0.0.1
 */
export default function AttendanceContextProvider({children}) {

    /** The attendance entity currently beeing edited. Dont set an initial value */
    const [currentAttendanceEntity, setCurrentAttendanceEntity] = useState<AttendanceEntity | undefined>();
    /** Expected to be initialized with `currentAttendanceEntity` on attendance screen render */
    const [lastSavedAttendanceEntity, setLastSavedAttendanceEntity] = useState<AttendanceEntity | undefined>();
    
    const { attendanceRespository } = useAttendanceRepository();
    
    /** Indicates whether `currentAttendanceEntity` has been modified compared to `lastSavedAttendanceEntity` */
    const [modified, setModified] = useState(false);
    
    const context = {
        updateCurrentAttendanceEntity,
        
        currentAttendanceEntity, setCurrentAttendanceEntity,
        lastSavedAttendanceEntity, updateLastSavedAttendanceEntity,
        
        modified, setModified
    }

 
    /**
     * Update value of `attendancEntityKey` for `currentAttendanceEntity` and update the `currentAttendanceEntity` state. If `value` is an
     * object also set the backreference assuming `getBackReferenceColumnName`.
     * 
     * @param attendanceEntityKey column name of attendance entity
     * @param attendancEntityValue the input value, any value of attendance entity props
     */
    function updateCurrentAttendanceEntity<T extends ValueOf<AttendanceEntity>>(attendanceEntityKey: keyof AttendanceEntity, attendancEntityValue: T): void {

        if (typeof attendancEntityValue === "object") {
            if (Array.isArray(attendancEntityValue))
                attendancEntityValue.forEach(ownedEntity => {
                    ownedEntity[attendanceRespository.getBackReferenceColumnName()] = currentAttendanceEntity.id;
                })
            else
                attendancEntityValue[attendanceRespository.getBackReferenceColumnName()] = currentAttendanceEntity.id;
        }
        
        setCurrentAttendanceEntity({
            ...currentAttendanceEntity,
            [attendanceEntityKey]: attendancEntityValue
        })
    }


    /**
     * Clones `attendanceEntity`, then updates state.
     * 
     * @param attendanceEntity to update the last saved state with.
     */
    function updateLastSavedAttendanceEntity(attendanceEntity: AttendanceEntity): void {

        setLastSavedAttendanceEntity(cloneObj(attendanceEntity));
    }


    return (
        <AttendanceContext.Provider value={context}>
            {children}
        </AttendanceContext.Provider>

    )
}


export const AttendanceContext = createContext({
    updateCurrentAttendanceEntity: <T extends ValueOf<AttendanceEntity>>(prop: keyof AttendanceEntity, value: T): void => {},

    currentAttendanceEntity: undefined as AttendanceEntity | undefined, 
    setCurrentAttendanceEntity: (attendanceEntity: AttendanceEntity): void => {},
    lastSavedAttendanceEntity: undefined as AttendanceEntity | undefined, 
    updateLastSavedAttendanceEntity: (attendanceEntity: AttendanceEntity): void => {},

    modified: false as boolean,
    setModified: (modified: boolean): void => {}
});
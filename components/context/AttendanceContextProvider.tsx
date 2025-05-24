import { AttendanceEntity } from "@/backend/DbSchema";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { log } from "@/utils/logUtils";
import { cloneObj } from "@/utils/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { GlobalAttendanceContext } from "./GlobalAttendanceContextProvider";


/**
 * Context available to all attendance edit sepcific screens of /(attendance).
 * 
 * @param children mandatory 
 * @since 0.0.1
 */
export default function AttendanceContextProvider({children}) {
    
    const { currentAttendanceEntity, setCurrentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { attendanceRespository } = useAttendanceRepository();
    
    /** Expected to be initialized with `currentAttendanceEntity` on attendance screen render */
    const [lastSavedAttendanceEntity, setLastSavedAttendanceEntity] = useState<AttendanceEntity | undefined>();
    
    /** Indicates whether `currentAttendanceEntity` has been modified compared to `lastSavedAttendanceEntity` */
    const [modified, setModified] = useState(false);
    
    const attendanceService = new AttendanceService();
    
    const context = {
        updateCurrentAttendanceEntity,
        
        lastSavedAttendanceEntity, setLastSavedAttendanceEntity,
        
        modified, setModified
    }
    
    useEffect(() => {
        setLastSavedAttendanceEntity(cloneObj(currentAttendanceEntity));
    
    }, []);


    useEffect(() => {
        // case: last saved instance has been instantiated
        log("current", currentAttendanceEntity)
        
        if (lastSavedAttendanceEntity) {
            setModified(attendanceService.isModified(currentAttendanceEntity, lastSavedAttendanceEntity));
            log("modified", attendanceService.isModified(currentAttendanceEntity, lastSavedAttendanceEntity))
        }

    }, [currentAttendanceEntity]);

 
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


    return (
        <AttendanceContext.Provider value={context}>
            {children}
        </AttendanceContext.Provider>

    )
}
export const AttendanceContext = createContext({
    updateCurrentAttendanceEntity: <T extends ValueOf<AttendanceEntity>>(prop: keyof AttendanceEntity, value: T): void => {},

    lastSavedAttendanceEntity: undefined as AttendanceEntity | undefined, 
    setLastSavedAttendanceEntity: (attendanceEntity: AttendanceEntity | undefined): void => {},

    modified: false as boolean,
    setModified: (modified: boolean): void => {}
});
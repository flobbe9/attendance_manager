import { SchoolSubject_Key } from '@/abstract/SchoolSubject';
import { ValueOf } from 'react-native-gesture-handler/lib/typescript/typeUtils';
import { AttendanceEntity } from "../DbSchema";


/**
 * Extend this class for attendance input validators.
 * 
 * @since latest
 */
export abstract class AbstractAttendanceValidator {

    /** The attendance entity currently beeing edited. Expected to keep beeing updated like a state */
    private currentAttendance: AttendanceEntity;
    
    /** All saved attendances so far */
    private allAttendances: AttendanceEntity[];    

    
    constructor(currentAttendanceEntity: AttendanceEntity, allAttendanceEntities: AttendanceEntity[]) {
        
        this.currentAttendance = currentAttendanceEntity;
        this.allAttendances = allAttendanceEntities;
    }


    protected getCurrentAttendance(): AttendanceEntity {

        return this.currentAttendance;
    }


    protected getAllAttendances(): AttendanceEntity[] {

        return this.allAttendances;
    }


    protected getAllAttendancesBySchoolSubject(schoolSubject: SchoolSubject_Key): AttendanceEntity[] {

        if (!schoolSubject)
            return [];

        return this.allAttendances
            .filter(attendanceEntity => attendanceEntity.schoolSubject === schoolSubject);
    }


    /**
     * Should only return values corresponding to `InputType`.
     * 
     * @return all possible (valid) values for `InputType` considering `currentAttendance` and `allAttendances`. Empty array if no valid values
     */
    public abstract getValidValues(): ValueOf<AttendanceEntity>[];


    // validateCurrentAttendance(): string | null
}
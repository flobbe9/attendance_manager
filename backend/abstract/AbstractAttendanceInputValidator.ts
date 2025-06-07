import { SchoolSubject_Key } from '@/abstract/SchoolSubject';
import { ValueOf } from 'react-native-gesture-handler/lib/typescript/typeUtils';
import { AttendanceEntity } from "../DbSchema";
import { cloneObj } from '@/utils/utils';
import { logWarn } from '@/utils/logUtils';


/**
 * Extend this class for attendance input validators.
 * 
 * @since latest
 */
export abstract class AbstractAttendanceInputValidator<InputValueType extends ValueOf<AttendanceEntity>> {

    /** The attendance entity currently beeing edited. Expected to keep beeing updated like a state */
    private currentAttendance: AttendanceEntity;
    
    /** All saved attendances from db */
    private savedAttendances: AttendanceEntity[];    

    
    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        
        this.currentAttendance = currentAttendanceEntity;
        this.savedAttendances = savedAttendanceEntities;
    }


    protected getCurrentAttendance(): AttendanceEntity {

        return this.currentAttendance;
    }


    protected getSavedAttendances(): AttendanceEntity[] {

        return this.savedAttendances;
    }


    /**
     * @returns new `savedAttendances` instance but with `currentAttendance` replacing it's id match
     */
    public getSavedAttendnacesReplaceWithCurrent(): AttendanceEntity[] {

        // case: current attendance not saved yet or no saved attendances
        if (!this.currentAttendance.id || !this.savedAttendances.length)
            return this.savedAttendances;

        const savedCurrentAttendanceTouple = (this.savedAttendances
            .map((savedAttendance, i) => [savedAttendance, i]) as [AttendanceEntity, number][])
            .find(([savedAttendance, ]) => this.currentAttendance.id === savedAttendance.id);
        
        // should not happen, if current is saved it should be among saved attendances
        if (!savedCurrentAttendanceTouple) {
            logWarn("Failed to find saved current attendance among saved attendances. This should not happen.");
            return this.savedAttendances;
        }

        const savedAttendances = cloneObj(this.savedAttendances);
        const [, savedCurrentAttendanceIndex] = savedCurrentAttendanceTouple;

        savedAttendances[savedCurrentAttendanceIndex] = this.currentAttendance;

        return savedAttendances;
    }


    /**
     * @param schoolSubject 
     * @returns saved attendances with `schoolSubject` possibly replacing the `currentAttendance` id match
     */
    protected getSavedAttendancesBySchoolSubject(schoolSubject: SchoolSubject_Key): AttendanceEntity[] {

        if (!schoolSubject)
            return [];

        return this.getSavedAttendnacesReplaceWithCurrent()
            .filter(attendanceEntity => attendanceEntity.schoolSubject === schoolSubject);
    }


    /**
     * Should only return values corresponding to `InputType`.
     * 
     * @return all possible (valid) values for `InputType` considering `currentAttendance` and `savedAttendances`. Empty array if no valid values
     */
    public abstract getValidValues(): ValueOf<AttendanceEntity>[];


    /**
     * Validate `inputValue`s conditions that don't take other attendance fields or future selections into consideration.
     * 
     * Returned error message gives a brief reason why `inputValue` is invalid. Wont list possible values. Will include the invalid value.
     * 
     * @param constantConditions any condition (propbably hardcoded) to validate `inputValue` against
     * @param inputValue to validate 
     * @returns `null` if `inputValue` is valid, an error message if invalid
     * @throws if falsy params
     */
    public abstract validateNonContextConditions(constantConditions: any, inputValue: InputValueType): string | null;


    /**
     * Validate `inputValue` only considering conditions that are related to other attendance fields (not including future selections).
     * 
     * @param constantConditions any condition (propbably hardcoded) to validate `inputValue` against
     * @param inputValue to validate 
     * @returns `null` if `inputValue` is valid, an error message if invalid
     * @throws if falsy params
     */
    public abstract validateContextConditions(constantConditions: any, inputValue: InputValueType): string | null;


    // validate future


    /**
     * Validate `inputValue` calling all validation methods of this class. Will throw if `inputValue` is falsy, validate "required" 
     * conditions before.
     * 
     * @param inputValue to validate 
     * @returns `null` if `inputValue` is valid or falsy, an error message if invalid
     */
    public abstract validate(inputValue: InputValueType): string | null;
}
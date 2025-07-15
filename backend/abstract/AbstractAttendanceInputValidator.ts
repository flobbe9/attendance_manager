import { SchoolSubject_Key } from '@/abstract/SchoolSubject';
import { logWarn } from '@/utils/logUtils';
import { cloneObj } from '@/utils/utils';
import { ValueOf } from 'react-native-gesture-handler/lib/typescript/typeUtils';
import { AttendanceEntity } from "../DbSchema";
import { AttendanceService } from '../services/AttendanceService';


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

    public attendanceService: AttendanceService;

    
    constructor(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]) {
        
        this.currentAttendance = currentAttendanceEntity;
        this.savedAttendances = savedAttendanceEntities;
        this.attendanceService = new AttendanceService();
    }


    protected getCurrentAttendance(): AttendanceEntity {

        return this.currentAttendance;
    }


    protected getSavedAttendances(): AttendanceEntity[] {

        return this.savedAttendances;
    }


    /**
     * @returns new `savedAttendances` instance but without `currentAttendance`s id match
     */
    public getSavedAttendancesWithoutCurrent(): AttendanceEntity[] {

        // case: current attendance not saved yet or no saved attendances
        if (!this.currentAttendance.id || !this.savedAttendances.length)
            return this.savedAttendances;

        const savedCurrentAttendanceIndex = this.savedAttendances.
            findIndex(savedAttendance => 
                this.currentAttendance.id === savedAttendance.id);
        
        // should not happen, if current is saved it should be among saved attendances
        if (savedCurrentAttendanceIndex === -1) {
            logWarn("Failed to find saved current attendance among saved attendances. This should not happen.");
            return this.savedAttendances;
        }

        const savedAttendances = cloneObj(this.savedAttendances);
        savedAttendances.splice(savedCurrentAttendanceIndex, 1);

        return savedAttendances;
    }


    /**
     * @returns `savedAttendances` with `currentAttendance` appended / replaced (only if both not falsy)
     */
    public getSavedAttendancesWithCurrent(): AttendanceEntity[] {

        if (!this.currentAttendance || !this.savedAttendances)
            return this.savedAttendances;

        const savedCurrentAttendanceIndex = this.savedAttendances.
            findIndex(savedAttendance => 
                this.currentAttendance.id === savedAttendance.id);
        
        // case: current is unsaved
        if (savedCurrentAttendanceIndex === -1)
            return [...this.savedAttendances, this.currentAttendance];

        const savedAttendances = cloneObj(this.savedAttendances);
        savedAttendances.splice(savedCurrentAttendanceIndex, 1, this.currentAttendance);

        return savedAttendances;
    }


    /**
     * @param schoolSubject 
     * @param includeCurrent whether to include current (`true`), remove it if saved (`false`) or just return unmodified `savedAttendances` (`null`)
     * Default is `false`
     * @returns saved attendances with `schoolSubject` possibly replacing the `currentAttendance` id match
     */
    protected getSavedAttendancesBySchoolSubject(schoolSubject: SchoolSubject_Key, includeCurrent: boolean | null = false): AttendanceEntity[] {

        if (!schoolSubject)
            return [];

        return this.getSavedAttendancesWithOrWithoutCurrent(includeCurrent)
            .filter(attendanceEntity => attendanceEntity.schoolSubject === schoolSubject);
    }


    /**
     * @param includeCurrent whether to include current (`true`), remove it if saved (`false`) or just return unmodified `savedAttendances` (`null`)
     * @returns 
     */
    protected getSavedAttendancesWithOrWithoutCurrent(includeCurrent: boolean | null): AttendanceEntity[] {

        if (includeCurrent === null)
            return this.savedAttendances;

        return includeCurrent ? this.getSavedAttendancesWithCurrent() : this.getSavedAttendancesWithoutCurrent();
    }


    /**
     * Implement at least one, {@link getValidValues()} or {@link getInvalidValues()}.
     * 
     * Should only return values corresponding to `InputType`.
     * 
     * @return all possible (valid) values for `InputType` considering `currentAttendance` and `savedAttendances`. Don't include values that
     * are irrelevant for validation. Empty array if no valid values
     */
    public abstract getValidValues(): ValueOf<AttendanceEntity>[];


    /**
     * Implement at least one, {@link getValidValues()} or {@link getInvalidValues()}.
     * 
     * @return all invalid values for `InputType` considering `currentAttendance` and `savedAttendances`. Empty array if no invalid values
     */
    public abstract getInvalidValues(): ValueOf<AttendanceEntity>[];


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


    /**
     * Go through unsatisfied conditions and make sure at least on combination of future attendances exists sothat those conditions can be met.
     * 
     * Wont force staying within the minimum amount of attendances.
     * 
     * @param inputValue that was last passed by user. It is assumed at this point that it has been validated with and without context
     * @returns `null` if all requirements are still satisfiable, an error message if not
     */
    public abstract validateFuture(inputValue: InputValueType): string | null;


    /**
     * Validate `inputValue` calling all validation methods of this class. 
     * 
     * Should not handle invalid, meaning no toasts or popups. Also dont throw
     * 
     * @param inputValue to validate 
     * @returns `null` if `inputValue` is valid or falsy, an error message if invalid
     */
    public abstract validate(inputValue: InputValueType): string | null;


    /**
     * @param inputValue to validate
     * @returns `true` if should validate on input change
     */
    public abstract shouldInputBeValidated(inputValue: InputValueType): boolean;
}
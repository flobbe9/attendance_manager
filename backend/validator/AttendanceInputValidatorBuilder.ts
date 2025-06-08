import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { AttendanceEntity } from "../DbSchema";
import { AbstractAttendanceInputValidator } from "../abstract/AbstractAttendanceInputValidator";
import { MusicSchoolYearValidator } from "./MusicSchoolYearValidator";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { SchoolYear } from "@/abstract/SchoolYear";
import { assertFalsyAndThrow } from "@/utils/utils";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";


/**
 * @since 0.0.1
 */
export class AttendanceInputValidatorBuilder {

    /** The attendance entity currently beeing edited. Expected to keep beeing updated like a state */
    private static currentAttendance: AttendanceEntity;
    
    /** All saved attendances from db */
    private static savedAttendances: AttendanceEntity[];    
    
    /** Will determine the input to validate */
    private static attendanceInputKey: keyof AttendanceEntity;

    private _schoolSubject: SchoolSubject_Key;



    private constructor() {
            
        // use builder() instead
    }
    
    
    public static builder(
        currentAttendanceEntity: AttendanceEntity, 
        savedAttendanceEntities: AttendanceEntity[], 
        
    ): AttendanceInputValidatorBuilder {
       
        this.currentAttendance = currentAttendanceEntity;
        this.savedAttendances = savedAttendanceEntities;

        return new AttendanceInputValidatorBuilder();
    }


    public schoolSubject(schoolSubject: SchoolSubject_Key): AttendanceInputValidatorBuilder {

        this._schoolSubject = schoolSubject;

        return this;
    }


    public inputType(attendanceInputKey: keyof AttendanceEntity): AttendanceInputValidatorBuilder {

        AttendanceInputValidatorBuilder.attendanceInputKey = attendanceInputKey;

        return this;
    }


    /**
     * @returns validator instance for `attendanceInputKey`
     * @throws if no validator is implemented for `attendanceInputKey`
     */
    public build(): AbstractAttendanceInputValidator<any> {

        switch (AttendanceInputValidatorBuilder.attendanceInputKey) {
            case "schoolYear":
                return this.buildSchoolYearValidator();

            default:
                throw new Error(`No validator implemented for input ${AttendanceInputValidatorBuilder.attendanceInputKey}`);
        }
    }
    
    
    private buildSchoolYearValidator(): AbstractSchoolYearValidator {
        
        assertFalsyAndThrow(AttendanceInputValidatorBuilder.currentAttendance, AttendanceInputValidatorBuilder.savedAttendances);
        
        switch (this._schoolSubject) {
            case "music":
                return new MusicSchoolYearValidator(AttendanceInputValidatorBuilder.currentAttendance, AttendanceInputValidatorBuilder.savedAttendances);
            
            // TODO
            case "history":
                return new MusicSchoolYearValidator(AttendanceInputValidatorBuilder.currentAttendance, AttendanceInputValidatorBuilder.savedAttendances);
            
            default:
                throw new Error(`No validator implementation found for schoolSubject ${this._schoolSubject}`);
        }
    }
}
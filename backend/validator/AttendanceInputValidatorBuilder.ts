import { assertFalsyAndThrow } from "@/utils/utils";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { AbstractAttendanceInputValidator } from "../abstract/AbstractAttendanceInputValidator";
import { AbstractSchoolYearValidator } from "../abstract/AbstractSchoolYearValidator";
import { HistorySchoolYearValidator } from "./HistorySchoolYearValidator";
import { MusicSchoolYearValidator } from "./MusicSchoolYearValidator";
import { DateValidator } from "./DateValidator";
import { LessonTopicValidator } from "./LessonTopicValidator";
import { ExaminantValidator } from "./ExaminantValidator";

/**
 * @since 0.0.1
 */
export class AttendanceInputValidatorBuilder {
    /** The attendance entity currently beeing edited. Expected to keep beeing updated like a state */
    private currentAttendance: AttendanceEntity;

    /** All saved attendances from db */
    private savedAttendances: AttendanceEntity[];

    /** Will determine the input to validate */
    private attendanceInputKey: keyof AttendanceEntity;

    private constructor() {
        // use builder() instead
    }

    public static builder(currentAttendanceEntity: AttendanceEntity, savedAttendanceEntities: AttendanceEntity[]): AttendanceInputValidatorBuilder {
        const newInstance = new AttendanceInputValidatorBuilder();
        newInstance.currentAttendance = currentAttendanceEntity;
        newInstance.savedAttendances = savedAttendanceEntities;

        return newInstance;
    }

    public inputType(attendanceInputKey: keyof AttendanceEntity): AttendanceInputValidatorBuilder {
        this.attendanceInputKey = attendanceInputKey;

        return this;
    }

    /**
     * @returns validator instance for `attendanceInputKey`
     * @throws if no validator is implemented for `attendanceInputKey`
     */
    public build(): AbstractAttendanceInputValidator<any> {
        switch (this.attendanceInputKey) {
            case "schoolYear":
                return this.buildSchoolYearValidator();

            case "date":
                return new DateValidator(this.currentAttendance, this.savedAttendances);

            case "musicLessonTopic":
                return new LessonTopicValidator(this.currentAttendance, this.savedAttendances);

            case "examinants":
                return new ExaminantValidator(this.currentAttendance, this.savedAttendances);

            default:
                throw new Error(`No validator implemented for input ${this.attendanceInputKey as string}`);
        }
    }

    private buildSchoolYearValidator(): AbstractSchoolYearValidator {
        assertFalsyAndThrow(this.currentAttendance, this.savedAttendances);

        const schoolSubject = this.currentAttendance.schoolSubject;

        switch (schoolSubject) {
            case "music":
                return new MusicSchoolYearValidator(this.currentAttendance, this.savedAttendances);

            case "history":
                return new HistorySchoolYearValidator(this.currentAttendance, this.savedAttendances);

            default:
                throw new Error(`No validator implementation found for schoolSubject ${schoolSubject}`);
        }
    }
}

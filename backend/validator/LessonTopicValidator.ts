import {
    MUSIC_LESSON_TOPIC_KEYS,
    MusicLessonTopic_Key
} from "@/abstract/MusicLessonTopic";
import {isSchoolYear} from "@/abstract/SchoolYear";
import {logDebug, logTrace} from "@/utils/logUtils";
import {ValueOf} from "react-native-gesture-handler/lib/typescript/typeUtils";
import {AbstractAttendanceInputValidator} from "../abstract/AbstractAttendanceInputValidator";
import {AttendanceInputValidatorBuilder} from "./AttendanceInputValidatorBuilder";
import { SchoolYearConditionOptions } from "../abstract/SchoolYearConditionOptions";
import { AttendanceEntity } from "../entities/AttendanceEntity";

/**
 * @since 0.1.0
 */
export class LessonTopicValidator extends AbstractAttendanceInputValidator<MusicLessonTopic_Key> {
    public getValidValues(): ValueOf<AttendanceEntity>[] {
        return MUSIC_LESSON_TOPIC_KEYS.filter(
            (lessonTopicKey) => this.validate(lessonTopicKey) === null
        );
    }

    public getInvalidValues(): ValueOf<AttendanceEntity>[] {
        // not implemented
        return [];
    }

    public validateNonContextConditions(
        constantConditions: any,
        inputValue: MusicLessonTopic_Key, 
        options?: SchoolYearConditionOptions
    ): string | null {
        // not implemented, see SchoolYearValidator implementations
        return null;
    }

    public validateContextConditions(
        constantConditions: any,
        inputValue: MusicLessonTopic_Key
    ): string | null {
        // not implemented, see SchoolYearValidator implementations
        return null;
    }

    public validateFuture(inputValue: MusicLessonTopic_Key): string | null {
        // not implemented, see SchoolYearValidator implementations
        return null;
    }

    public validate(inputValue: MusicLessonTopic_Key): string | null {
        if (!this.shouldInputBeValidated(inputValue)) return null;

        let errorMessage: string = null;

        logTrace("validate topic", inputValue);

        if ((errorMessage = this.validateNonContextConditions([], inputValue)) !== null)
            return errorMessage;

        logTrace("validate topic - non context valid", inputValue);

        if ((errorMessage = this.validateContextConditions([], inputValue)) !== null)
            return errorMessage;

        logTrace("validate topic - context valid", inputValue);

        if ((errorMessage = this.validateFuture(inputValue)) !== null) return errorMessage;

        logTrace("validate topic - future valid", inputValue);

        const originalMusicLessonTopic = this.getCurrentAttendance().musicLessonTopic;
        try {
            this.getCurrentAttendance().musicLessonTopic = inputValue;
            const schoolYearValidator = AttendanceInputValidatorBuilder.builder(
                this.getCurrentAttendance(),
                this.getSavedAttendances()
            )
                .inputType("schoolYear")
                .build();

            if (
                (errorMessage = schoolYearValidator.validate(
                    this.getCurrentAttendance().schoolYear
                )) !== null
            )
                return errorMessage;
        } finally {
            this.getCurrentAttendance().musicLessonTopic = originalMusicLessonTopic;
        }

        logTrace(
            "schoolyear for lesson topic valid",
            inputValue,
            this.getCurrentAttendance().schoolYear
        );

        return null;
    }

    public shouldInputBeValidated(inputValue: MusicLessonTopic_Key): boolean {
        return (
            this.attendanceService.isSelectInputFilledOut(inputValue) &&
            isSchoolYear(this.getCurrentAttendance().schoolYear) &&
            this.attendanceService.hasExaminant(
                this.getCurrentAttendance(),
                this.getCurrentAttendance().schoolSubject
            )
        );
    }
}

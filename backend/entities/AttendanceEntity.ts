import {MusicLessonTopic_Key} from "@/abstract/MusicLessonTopic";
import {SchoolSubject_Key} from "@/abstract/SchoolSubject";
import {SchoolYear} from "@/abstract/SchoolYear";
import AbstractEntity from "../abstract/Abstract_Schema";
import {ExaminantEntity} from "./ExaminantEntity";
import {SchoolclassModeEntity} from "./SchoolclassModeEntity";

export class AttendanceEntity extends AbstractEntity {
    schoolSubject: SchoolSubject_Key;
    /** Date of the attendance */
    date?: Date;
    schoolYear: SchoolYear;
    /** Only mandatory if `schoolSubject` is "Musik" */
    musicLessonTopic?: MusicLessonTopic_Key;
    /** Cannot be empty */
    examinants: ExaminantEntity[];
    /** Default should be "ownClass" */
    schoolclassMode: SchoolclassModeEntity;
    note?: string;
    note2?: string;
}

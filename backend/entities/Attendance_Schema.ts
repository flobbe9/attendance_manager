import { MUSIC_LESSON_TOPIC_KEYS, MusicLessonTopic, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { SCHOOL_SUBJECT_KEYS, SchoolSubject, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SCHOOL_YEARS, SchoolYear } from "@/abstract/SchoolYear";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import AbstractEntity, { AbstractEntity_Table } from "../abstract/AbstractEntity_Schema";
import { Examinant_Table, ExaminantEntity } from "./Examinant_Schema";
import { SchoolclassMode_Table, SchoolclassModeEntity } from './SchoolclassMode_Schema';


type TableName = "Attendance";
const TableNameValue: TableName = "Attendance";


/**
 * @since 0.0.1
 */
export const Attendance_Table = sqliteTable(
    TableNameValue, 
    {
        ...AbstractEntity_Table,
        schoolSubject: text({ enum: SCHOOL_SUBJECT_KEYS as [SchoolSubject_Key]}).notNull(),
        date: integer({ mode: 'timestamp' }).notNull(),
        musicLessonTopic: text({enum: MUSIC_LESSON_TOPIC_KEYS as [MusicLessonTopic_Key]}),
        schoolYear: text( "school_year", { enum: SCHOOL_YEARS as [SchoolYear]}).notNull(),
        note: text(),
        note2: text(),
    }
);


export const Attendance_Relations = relations(
    Attendance_Table, 
    ({many, one}) => ({
        examinants: many(Examinant_Table),
        schoolclassMode: one(SchoolclassMode_Table)
    })
)


export interface AttendanceEntity extends AbstractEntity {

    schoolSubject: SchoolSubject_Key,
    /** Date of the attendance */
    date: Date,
    schoolYear: SchoolYear,
    /** Only mandatory if ```schoolSubject``` is "Musik" */
    musicLessonTopic: MusicLessonTopic_Key | null,
    /** Cannot be empty */
    examinants: ExaminantEntity[],
    /** Default should be "ownClass" */
    schoolclassMode: SchoolclassModeEntity,
    note: string | null,
    note2: string | null
}
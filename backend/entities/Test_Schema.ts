import { MUSIC_LESSON_TOPIC_KEYS, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { SCHOOL_SUBJECT_KEYS, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SCHOOL_YEARS, SchoolYear } from "@/abstract/SchoolYear";
import { text } from "drizzle-orm/sqlite-core";
import { integer } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import AbstractEntity, { AbstractEntity_Table } from "../abstract/AbstractEntity_Schema";

// TODO: remove eventually
export const Test_Table = sqliteTable(
    "Test", 
    {
        ...AbstractEntity_Table,
        schoolSubject: text("school_subject", { enum: SCHOOL_SUBJECT_KEYS as [SchoolSubject_Key]}).notNull(),
        date: integer({ mode: 'timestamp' }).notNull(),
        musicLessonTopic: text("music_lesson_topic", {enum: MUSIC_LESSON_TOPIC_KEYS as [MusicLessonTopic_Key]}),
        schoolYear: text( "school_year", { enum: SCHOOL_YEARS as [SchoolYear]}).notNull(),
        note: text(),
        note2: text(),
    }
);


export interface TestEntity extends AbstractEntity {

    schoolSubject: SchoolSubject_Key,
    /** Date of the attendance */
    date: Date,
    schoolYear: SchoolYear,
    /** Only mandatory if ```schoolSubject``` is "Musik" */
    musicLessonTopic: MusicLessonTopic_Key | null,
    note: string | null,
    note2: string | null
}
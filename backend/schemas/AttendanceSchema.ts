import { MUSIC_LESSON_TOPIC_KEYS, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { SCHOOL_SUBJECT_KEYS, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SCHOOL_YEARS, SchoolYear } from "@/abstract/SchoolYear";
import { SQL_BLOB_SIZE } from "@/utils/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Abstract_Table } from "../abstract/Abstract_Schema";

const ATTENDANCE_TABLE_NAME = "attendance";

/**
 * @since 0.0.1
 */
export const Attendance_Table = sqliteTable(ATTENDANCE_TABLE_NAME, {
    ...Abstract_Table,
    schoolSubject: text({enum: SCHOOL_SUBJECT_KEYS as [SchoolSubject_Key]}).notNull(),
    date: integer({mode: "timestamp"}),
    musicLessonTopic: text({enum: MUSIC_LESSON_TOPIC_KEYS as [MusicLessonTopic_Key]}),
    schoolYear: text({enum: SCHOOL_YEARS as [SchoolYear]}),
    note: text({length: SQL_BLOB_SIZE}),
    note2: text({length: SQL_BLOB_SIZE}),
});

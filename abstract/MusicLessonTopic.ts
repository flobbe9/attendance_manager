/**
 * NOTE: dont change, values are constants in db
 */
const musicLessonTopicKeysObj = {
    "sound": 0,
    "rhythm": 1,
    "structure": 2,
    "language": 3,
    "history": 4
}
export type MusicLessonTopic_Key = keyof typeof musicLessonTopicKeysObj;
export const MUSIC_LESSON_TOPIC_KEYS: MusicLessonTopic_Key[] = Object.keys(musicLessonTopicKeysObj) as MusicLessonTopic_Key[]; 

const musicLessonTopicValuesObj = {
    "Musikalische Gestaltungsmittel Klang": 0, 
    "Musikalische Gestaltungsmittel Rhythmik": 1,
    "Musikalische Gestaltungsmittel Form": 2,
    "Musik in Verbindung mit Sprache": 3,
    "Musik in Verbindung mit Geschichte":  4
};
/**
 *  @since 0.0.1
*/
export type MusicLessonTopic = keyof typeof musicLessonTopicValuesObj;
export const MUSIC_LESSON_TOPICS: MusicLessonTopic[] = Object.keys(musicLessonTopicValuesObj) as MusicLessonTopic[]; 
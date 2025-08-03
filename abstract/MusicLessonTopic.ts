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
    "Klang (I)": 0, 
    "Rhythmik, Melodik, Harmonik, Dynamik, Artikulation (I)": 1,
    "Form und Struktur (II)": 2,
    "Sprache, Szene, Bild, Film, Programm (I & II)": 3,
    "Geschichte, Gesellschaft, Kultur (II)":  4
};
/**
 *  @since 0.0.1
*/
export type MusicLessonTopic = keyof typeof musicLessonTopicValuesObj;
export const MUSIC_LESSON_TOPICS: MusicLessonTopic[] = Object.keys(musicLessonTopicValuesObj) as MusicLessonTopic[]; 


export function getMusicLessonTopicByMusicLessonTopicKey(musicLessonTopicKey: MusicLessonTopic_Key): MusicLessonTopic {

    const musicLessonTopicKeyIndex = MUSIC_LESSON_TOPIC_KEYS.indexOf(musicLessonTopicKey);

    return MUSIC_LESSON_TOPICS[musicLessonTopicKeyIndex];
}


export function getMusicLessonTopicKeyByMusicLessonTopic(musicLessonTopic: MusicLessonTopic): MusicLessonTopic_Key {

    const musicLessonTopicIndex = MUSIC_LESSON_TOPICS.indexOf(musicLessonTopic);

    return MUSIC_LESSON_TOPIC_KEYS[musicLessonTopicIndex];
}
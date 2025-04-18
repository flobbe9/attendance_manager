const subjectObj = {"Geschichte": 0, "Musik": 1};
type SubjectType = typeof subjectObj;

/**
 *  @since 0.0.1
 */
export type Subject = keyof SubjectType;
export const SUBJECTS: Subject[] = Object.keys(subjectObj) as Subject[]; 
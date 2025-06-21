import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SchoolYearCondition } from "@/backend/abstract/SchoolYearCondition";

/** Only counts if the music examinant is present. The one required GUB is included in this */
export const NUM_REQUIRED_MUSIC_ATTENDANCES = 9;
/** Only counts if the history examinant is present. The one required GUB is included in this */
export const NUM_REQUIRED_HISTORY_ATTENDANCES = 9;
export const NUM_REQUIRED_GUBS = 2;

/** Describes what lesson topics need to covered how often and in which school year. For music subject */
export const MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS: SchoolYearCondition[] = [
    {
        lessonTopic: "sound",
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: null,
        attendanceCount: 0
    },
    {
        lessonTopic: "rhythm",
        schoolYearRange: {
            min: "5",
            max: "8"
        },
        minAttendances: 2,
        maxAttendances: null,
        attendanceCount: 0
    },
    {
        lessonTopic: "structure",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null,
        attendanceCount: 0
    },
    {
        lessonTopic: "language",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null,
        attendanceCount: 0
    },
    {
        lessonTopic: "history",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null,
        attendanceCount: 0
    }
]

/** Describes how often attendances can / must take place in which school year. For music subject */
export const MUSIC_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
    {
        schoolYearRange: {
            min: "5",
            max: "6"
        },
        minAttendances: 1,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "7",
            max: "8"
        },
        minAttendances: 1,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "9",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "11",
            max: "11"
        },
        minAttendances: 1,
        maxAttendances: 3,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "12",
            max: "13"
        },
        minAttendances: 2,
        maxAttendances: 4,
        attendanceCount: 0
    },
    // Sekundarstufe 1 (sek1)
    {
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 4,
        maxAttendances: 5,
        attendanceCount: 0,
        isSchoolYearRangeNotDistinct: true
    },
    // Sekundarstufe 2 (sek2)
    {
        schoolYearRange: {
            min: "11",
            max: "13"
        },
        minAttendances: 4,
        maxAttendances: 5,
        attendanceCount: 0,
        isSchoolYearRangeNotDistinct: true
    },
]

/** 
 * Describes how often attendances can / must take place in which school year. 
 * 
 * Variants cannot be combined.
 * 
 * For history subject 
 */
export const HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_1: SchoolYearCondition[] = [
    {
        schoolYearRange: {
            min: "5",
            max: "6"
        },
        minAttendances: 2,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "7",
            max: "8"
        },
        minAttendances: 2,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "9",
            max: "10"
        },
        minAttendances: 2,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "11",
            max: "11"
        },
        minAttendances: 1,
        maxAttendances: 1,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "12",
            max: "13"
        },
        minAttendances: 2,
        maxAttendances: 2,
        attendanceCount: 0
    },
]

/** 
 * Describes how often attendances can / must take place in which school year. 
 * 
 * Variants cannot be combined.
 * 
 * For history subject 
 */
export const HISTORY_SCHOOL_YEAR_CONDITIONS_VARIANT_2: SchoolYearCondition[] = [
    {
        schoolYearRange: {
            min: "5",
            max: "6"
        },
        minAttendances: 2,
        maxAttendances: 2,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "7",
            max: "10"
        },
        minAttendances: 3,
        maxAttendances: 3,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "11",
            max: "11"
        },
        minAttendances: 1,
        maxAttendances: 1,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "12",
            max: "13"
        },
        minAttendances: 3,
        maxAttendances: 3,
        attendanceCount: 0
    },
]


/**
 * One for each subject (that's hardcoded).
 */
export const GUB_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
    {
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: 1,
        attendanceCount: 0
    },
    {
        schoolYearRange: {
            min: "11",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: 1,
        attendanceCount: 0
    }
]

export function getTotalRequiredGubs(): number {
    return GUB_SCHOOL_YEAR_CONDITIONS
        .map(condition => condition.minAttendances)
        .reduce((prev, cur) => prev + cur);
}

export const GUB_MUSIC_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
    {
        minAttendances: 1,
        maxAttendances: 1,
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        attendanceCount: 0
    }
]

export const GUB_HISTORY_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
    {
        minAttendances: 1,
        maxAttendances: 1,
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        attendanceCount: 0
    }
]

export function getGubSubjectSchoolYearConditionsBySubject(schoolSubject: SchoolSubject_Key): SchoolYearCondition[] {

    if (schoolSubject === "music")
        return GUB_MUSIC_SCHOOL_YEAR_CONDITIONS;

    if (schoolSubject === "history")
         return GUB_HISTORY_SCHOOL_YEAR_CONDITIONS;

    return [];
}
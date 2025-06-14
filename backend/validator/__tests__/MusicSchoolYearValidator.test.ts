import { equalsSchoolYearConditions, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "@/backend/abstract/SchoolYearCondition";
import { AttendanceEntity } from "@/backend/DbSchema";
import { MusicSchoolYearValidator } from "../MusicSchoolYearValidator";
import { cloneObj } from "@/utils/utils";
import { SchoolYear } from "@/abstract/SchoolYear";

describe("getCurrentlyUnsatisfiedLessonTopicConditions", () => {
    test("Should remove conditions with falsy min value", () => {
        // set both mock condition range min attendances to null
        const mockConditions = cloneObj(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);
        mockConditions[3].minAttendances = null;
        mockConditions[4].minAttendances = null;

        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: mockConditions[3].lessonTopic
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: mockConditions[4].lessonTopic
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedLessonTopicConditions(mockConditions);

        expect(equalsSchoolYearConditions(mockConditions, unsatisfiedConditions1)).toBe(false);
        // should have removed 5-6 and 5-10 range conditions
        expect(unsatisfiedConditions1.length).toBe(mockConditions.length - 2);
    })


    test("Should remove conditions with min value == 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolYear: "7",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedLessonTopicConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, unsatisfiedConditions1)).toBe(false);
        // should have removed 7-8 range condition
        expect(unsatisfiedConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS.length - 1);
    })


    test("Should not remove conditions if min value != 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolYear: "8",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedLessonTopicConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, unsatisfiedConditions1)).toBe(false);
        
        // should not have removed condition
        expect(unsatisfiedConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS.length);
        // should have decreased condition
        expect(unsatisfiedConditions1[1].minAttendances).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS[1].minAttendances - 1);
    });
})


describe("validateFuture", () => {
    test("Should not validate but return null", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "history",
                schoolYear: "5",
                musicLessonTopic: "sound",
                examinants: [{role: "history"}],
                schoolclassMode: null
            }
        ]
        const currentAttendance = [...savedAttendances][0];
        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        // wrong subject
        expect(validator.validateFuture("5")).toBe(null);

        // invalid schoolYear
        expect(validator.validateFuture(null)).toBe(null);
        expect(validator.validateFuture("1" as SchoolYear)).toBe(null);

        currentAttendance.schoolSubject = "music";
        savedAttendances = [];
        // no saved attendances
        expect(validator.validateFuture("5")).toBe(null);
    })
})


describe("validateFuture", () => {
    test("Should be valid", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "9",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "13",
                musicLessonTopic: "structure",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 3,
                schoolSubject: "music",
                schoolYear: "12",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 4,
                schoolSubject: "music",
                schoolYear: "11",
                musicLessonTopic: "history",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "12",
                musicLessonTopic: "history",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            // first invalid attendance
            {
                id: 6,
                schoolSubject: "music",
                schoolYear: "8",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 7,
                schoolSubject: "music",
                schoolYear: "6",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 8,
                schoolSubject: "music",
                schoolYear: "5",
                musicLessonTopic: "rhythm",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
        ]
        const currentAttendance = savedAttendances[savedAttendances.length - 1];
        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        // should find rhythm to be a match with range 7-8
        expect(validator.validateFuture(currentAttendance.schoolYear)).toBe(null);
    })


    test("Should be valid", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "8",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "13",
                musicLessonTopic: "structure",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 3,
                schoolSubject: "music",
                schoolYear: "12",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 4,
                schoolSubject: "music",
                schoolYear: "11",
                musicLessonTopic: "history",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "12",
                musicLessonTopic: "history",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 6,
                schoolSubject: "music",
                schoolYear: "8",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 7,
                schoolSubject: "music",
                schoolYear: "6",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 8,
                schoolSubject: "music",
                schoolYear: "5",
                musicLessonTopic: "rhythm",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
        ]
        const currentAttendance = savedAttendances[savedAttendances.length - 1];
        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        // 7-8 maxed out, should throw
        expect(validator.validateFuture(currentAttendance.schoolYear)).not.toBe(null);
    })
})



// clone this before altering to avoid collisions between tests
const MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS: SchoolYearCondition[] = [
    {
        lessonTopic: "sound",
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        lessonTopic: "rhythm",
        schoolYearRange: {
            min: "5",
            max: "8"
        },
        minAttendances: 2,
        maxAttendances: null
    },
    {
        lessonTopic: "structure",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        lessonTopic: "language",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        lessonTopic: "history",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    }
]
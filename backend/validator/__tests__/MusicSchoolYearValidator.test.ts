import { equalsSchoolYearConditions, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "@/backend/abstract/SchoolYearCondition";
import { AttendanceEntity } from "@/backend/DbSchema";
import { MusicSchoolYearValidator } from "../MusicSchoolYearValidator";
import { cloneObj } from "@/utils/utils";

describe("getCurrentlyRequiredLessonTopics", () => {
    test("Should remove conditions with falsy min value", () => {
        // set both mock condition range min attendances to null
        const mockConditions = cloneObj(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);
        mockConditions[3].minAttendances = null;
        mockConditions[4].minAttendances = null;

        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null,
                musicLessonTopic: mockConditions[3].lessonTopic
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null,
                musicLessonTopic: mockConditions[4].lessonTopic
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredLessonTopics(mockConditions);

        expect(equalsSchoolYearConditions(mockConditions, requiredConditions1)).toBe(false);
        // should have removed 5-6 and 5-10 range conditions
        expect(requiredConditions1.length).toBe(mockConditions.length - 2);
    })


    test("Should remove conditions with min value == 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "7",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredLessonTopics(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, requiredConditions1)).toBe(false);
        // should have removed 7-8 range condition
        expect(requiredConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS.length - 1);
    })


    test("Should not remove conditions if min value != 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "12",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredLessonTopics(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, requiredConditions1)).toBe(false);
        
        // should not have removed condition
        expect(requiredConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS.length);
        // should have decreased condition
        expect(requiredConditions1[1].minAttendances).toBe(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS[1].minAttendances - 1);
    });
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
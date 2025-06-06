import { equalsSchoolYearConditions, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "@/backend/abstract/SchoolYearCondition";
import { AttendanceEntity } from "@/backend/DbSchema";
import { MusicSchoolYearValidator } from "../MusicSchoolYearValidator";
import { cloneObj } from "@/utils/utils";

describe("getCurrentlyRequiredSchoolYearConditions", () => {
    test("Should remove conditions with falsy min value", () => {
        // set both mock condition range min attendances to null
        const mockConditions = cloneObj(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);
        mockConditions[0].minAttendances = null;
        mockConditions[5].minAttendances = null;

        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredSchoolYearConditions(mockConditions);

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
                schoolclassMode: null
            },
            {
                schoolYear: "7",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, requiredConditions1)).toBe(false);
        // should have removed 7-8 range condition
        expect(requiredConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS.length - 1);
    })

    test("Should remove conditions with min value == 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "12",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const requiredConditions1 = validator.getCurrentlyRequiredSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, requiredConditions1)).toBe(false);
        
        // should not have removed condition
        expect(requiredConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS.length);
        // should have decreased condition
        expect(requiredConditions1[4].minAttendances).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS[4].minAttendances - 1);
    });
})


describe("validateNonContextConditions", () => {
    test("Should be valid", () => {
        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).toBeNull();
    });

    
    test("Should be invalid", () => {
        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).not.toBeNull();
    });


    test("Should throw if falsy param", () => {

        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        expect(() => validator.validateNonContextConditions(null, schoolYear)).toThrow();
        expect(() => validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, null)).toThrow();
    })
    

    test("Missing condition for schoolYear, should return null", () => {

        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        const allConditions = cloneObj(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);
        // remove year 5 conditions
        allConditions.splice(0, 1);
        allConditions.splice(0, 5);

        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        // should have no year 5 conditions
        expect(findSchoolYearConditionsBySchoolYearRange(schoolYear, allConditions).length).toBe(0);
        expect(validator.validateNonContextConditions(allConditions, schoolYear)).toBeNull();
    })


    // should only consider subject conditions
    test("Should only consider saved music attendances", () => {
        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "history",
                examinants: [],
                schoolclassMode: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        // only count music saved attendances
        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).toBeNull();

        // max out year 5 music attendaces
        savedAttendances[0].schoolSubject = "music";
        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).not.toBeNull();
    });


    test("Should only consider if current subject is music", () => {
        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null
            }
        ];

        const currentAttendanceEntity: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [],
            schoolclassMode: null
        }
        const validator = new MusicSchoolYearValidator(currentAttendanceEntity, savedAttendances);


        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).toBeNull();

        currentAttendanceEntity.schoolSubject = null;
        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).toBeNull();

        // max out year 5 music attendaces
        currentAttendanceEntity.schoolSubject = "music";
        expect(validator.validateNonContextConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, schoolYear)).not.toBeNull();
    });
})


describe("validateContextConditions", () => {
    test("Should be valid", () => {
        const schoolYear = "5";
        
        const currentAttendanceEntity: AttendanceEntity = {
            schoolYear: null,
            schoolSubject: "music",
            examinants: [],
            schoolclassMode: null,
            musicLessonTopic: "rhythm"
        };

        const validator = new MusicSchoolYearValidator(currentAttendanceEntity, []);

        expect(validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)).toBeNull();
    });

    
    test("Should be invalid", () => {
        const schoolYear = "13";
        
        const currentAttendanceEntity: AttendanceEntity = {
            schoolYear: null,
            schoolSubject: "music",
            examinants: [],
            schoolclassMode: null,
            musicLessonTopic: "rhythm"
        };

        const validator = new MusicSchoolYearValidator(currentAttendanceEntity, []);

        expect(validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)).not.toBeNull();
    });


    test("Should throw if falsy", () => {
        const schoolYear = "5";
        
        const currentAttendanceEntity: AttendanceEntity = {
            schoolYear: null,
            schoolSubject: "music",
            examinants: [],
            schoolclassMode: null,
            musicLessonTopic: "rhythm"
        };

        const validator = new MusicSchoolYearValidator(currentAttendanceEntity, []);

        expect(() => validator.validateContextConditions(null, schoolYear)).toThrow();
        expect(() => validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, null)).toThrow();
    });
    

    test("Missing condition for schoolYear, should return null", () => {

        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: null,
                schoolSubject: "music",
                examinants: [],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            }
        ];
        const allConditions: SchoolYearCondition[] = [
            {
                topic: "rhythm",
                schoolYearRange: {
                    min: "6",
                    max: "8"
                },
                minAttendances: 2,
                maxAttendances: null,
            },
        ]

        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        // should have no year 5 conditions
        expect(findSchoolYearConditionsBySchoolYearRange(schoolYear, allConditions).length).toBe(0);
        expect(validator.validateContextConditions(allConditions, schoolYear)).toBeNull();
    })


    test("Should only consider if current subject is music", () => {
        const schoolYear = "9";
        
        const currentAttendanceEntity: AttendanceEntity = {
            schoolYear: null,
            schoolSubject: "history",
            examinants: [],
            schoolclassMode: null,
            musicLessonTopic: "rhythm"
        };

        let validator = new MusicSchoolYearValidator(currentAttendanceEntity, []);

        // valid allthough schoolyear does not match, because subject is not music
        expect(validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)).toBeNull();

        currentAttendanceEntity.schoolSubject = null;
        expect(validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)).toBeNull();

        currentAttendanceEntity.schoolSubject = "music";
        expect(validator.validateContextConditions(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, schoolYear)).not.toBeNull();
    });
})


// clone this before altering to avoid collisions between tests
const MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
    {
        schoolYearRange: {
            min: "5",
            max: "6"
        },
        minAttendances: 1,
        maxAttendances: 2
    },
    {
        schoolYearRange: {
            min: "7",
            max: "8"
        },
        minAttendances: 1,
        maxAttendances: 2
    },
    {
        schoolYearRange: {
            min: "9",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: 2
    },
    {
        schoolYearRange: {
            min: "11",
            max: "11"
        },
        minAttendances: 1,
        maxAttendances: 3
    },
    {
        schoolYearRange: {
            min: "12",
            max: "13"
        },
        minAttendances: 2,
        maxAttendances: 4
    },
    // Sekundarstufe 1 (sek1)
    {
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 4,
        maxAttendances: 5
    },
    // Sekundarstufe 2 (sek2)
    {
        schoolYearRange: {
            min: "11",
            max: "13"
        },
        minAttendances: 4,
        maxAttendances: 5
    },
]

const MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS: SchoolYearCondition[] = [
    {
        topic: "sound",
        schoolYearRange: {
            min: "5",
            max: "10"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        topic: "rhythm",
        schoolYearRange: {
            min: "5",
            max: "8"
        },
        minAttendances: 2,
        maxAttendances: null
    },
    {
        topic: "structure",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        topic: "language",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    },
    {
        topic: "history",
        schoolYearRange: {
            min: "5",
            max: "13"
        },
        minAttendances: 1,
        maxAttendances: null
    }
]

// validate CurrentContextConditions
    // compatible with topic
    // incompatible with topic
    // falsy throw
    // no condition null
    // should only consider music
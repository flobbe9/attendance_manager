import { equalsSchoolYearConditions, findSchoolYearConditionsBySchoolYearRange, SchoolYearCondition } from "@/backend/abstract/SchoolYearCondition";
import { AttendanceEntity } from "@/backend/DbSchema";
import { MusicSchoolYearValidator } from "../MusicSchoolYearValidator";
import { cloneObj } from "@/utils/utils";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { isWithinSchoolYearRange } from "@/backend/abstract/SchoolYearRange";
import { SchoolYear } from "@/abstract/SchoolYear";

describe("getCurrentlyUnsatisfiedSchoolYearConditions", () => {
    test("Should remove conditions with falsy min value", () => {
        // set both mock condition range min attendances to null
        const mockConditions = cloneObj(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);
        mockConditions[0].minAttendances = null;
        mockConditions[5].minAttendances = null;

        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedSchoolYearConditions(mockConditions);

        expect(equalsSchoolYearConditions(mockConditions, unsatisfiedConditions1)).toBe(false);
        // should have removed 5-6 and 5-10 range conditions
        expect(unsatisfiedConditions1.length).toBe(mockConditions.length - 2);
    })

    test("Should remove conditions with min value == 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "7",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "7",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, unsatisfiedConditions1)).toBe(false);
        // should have removed 7-8 range condition
        expect(unsatisfiedConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS.length - 1);
    })

    test("Should not remove conditions if min value != 0", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolYear: "12",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        let validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);
        const unsatisfiedConditions1 = validator.getCurrentlyUnsatisfiedSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS);

        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, unsatisfiedConditions1)).toBe(false);
        
        // should not have removed condition
        expect(unsatisfiedConditions1.length).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS.length);
        // should have decreased condition
        expect(unsatisfiedConditions1[4].minAttendances).toBe(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS[4].minAttendances - 1);
    });
})


describe("validateNonContextConditions", () => {
    test("Should be valid", () => {
        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
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
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "6",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
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
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        expect(() => validator.validateNonContextConditions(null, schoolYear)).toThrow();
    })
    

    test("Missing condition for schoolYear, should return null", () => {

        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
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
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
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
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            {
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];

        const currentAttendanceEntity: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [{role: "music"}],
            schoolclassMode: null,
            musicLessonTopic: null
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
            examinants: [{role: "music"}],
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
            examinants: [{role: "music"}],
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
            examinants: [{role: "music"}],
            schoolclassMode: null,
            musicLessonTopic: "rhythm"
        };

        const validator = new MusicSchoolYearValidator(currentAttendanceEntity, []);

        expect(() => validator.validateContextConditions(null, schoolYear)).toThrow();
    });
    

    test("Missing condition for schoolYear, should return null", () => {

        const schoolYear = "5";
        let savedAttendances: AttendanceEntity[] = [
            {
                schoolYear: null,
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            }
        ];
        const allConditions: SchoolYearCondition[] = [
            {
                lessonTopic: "rhythm",
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
            examinants: [{role: "music"}],
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


describe("getSavedAttendancesWithoutCurrent", () => {

    test("Current attendance not saved, should not return different saved attendances", () => {
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "5",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            { 
                id: 2,
                schoolSubject: "music",
                schoolYear: "5",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ]
        const currentAttendance: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: null
        }
        const attendanceService = new AttendanceService();

        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithoutCurrent())).toBe(false);
        expect(validator.getSavedAttendancesWithoutCurrent().length).toBe(savedAttendances.length);
    })


    test("Current attendance saved, should return different saved attendances", () => {
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "5",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            },
            { 
                id: 2,
                schoolSubject: "music",
                schoolYear: "5",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ]
        const currentAttendance: AttendanceEntity = {
            id: 1,
            schoolSubject: "history", // different
            schoolYear: "5",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: null
        }
        const attendanceService = new AttendanceService();

        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithoutCurrent())).toBe(true);
        expect(validator.getSavedAttendancesWithoutCurrent().length).toBe(savedAttendances.length - 1);
    })


    test("No saved attendances, should return []", () => {
        const savedAttendances: AttendanceEntity[] = []
        const currentAttendance: AttendanceEntity = {
            schoolSubject: "music", // different
            schoolYear: "5",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: null
        }

        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        expect(validator.getSavedAttendancesWithoutCurrent().length).toBe(0);
    })
})


describe("getSchoolYearConditionsWithCount", () => {

    test("Should throw if falsy params", () => {
        const savedAttendances: AttendanceEntity[] = []
        const currentAttendance: AttendanceEntity = {
            id: 1,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [{role: "music"}],
            schoolclassMode: null,
            musicLessonTopic: null
        }
        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        expect(() => validator.getSchoolYearConditionsWithCount(null, (a, b) => true)).toThrow();
        expect(() => validator.getSchoolYearConditionsWithCount(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, null)).toThrow();
    });


    test("No saved attendances - should not change conditions", () => {
        const savedAttendances: AttendanceEntity[] = []
        const currentAttendance: AttendanceEntity = {
            id: 1,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [{role: "music"}],
            schoolclassMode: null,
            musicLessonTopic: null
        }
        const validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);

        const conditionsWithCount = validator.getSchoolYearConditionsWithCount(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, (a, b) => false);
        expect(equalsSchoolYearConditions(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, conditionsWithCount)).toBe(true);
    })


    test("Topic match, should count up", () => {
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "5",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "5",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            }
        ]
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        const countCondition = (savedAttendance: AttendanceEntity, condition: SchoolYearCondition): boolean => {
            return savedAttendance.musicLessonTopic === condition.lessonTopic;
        }
        const conditionsWithCount = validator.getSchoolYearConditionsWithCount(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS, countCondition);

        // confirm count has started at 0
        expect(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS[0].attendanceCount).toBe(0);
        expect(MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS[3].attendanceCount).toBe(0);

        expect(conditionsWithCount[0].attendanceCount).toBe(1);
        expect(conditionsWithCount[3].attendanceCount).toBe(1);
    })


    test("Topic match, should count up", () => {
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music",
                schoolYear: "5",
                musicLessonTopic: "sound",
                examinants: [{role: "music"}],
                schoolclassMode: null
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "11",
                musicLessonTopic: "language",
                examinants: [{role: "music"}],
                schoolclassMode: null
            }
        ]
        const validator = new MusicSchoolYearValidator(savedAttendances[0], savedAttendances);

        const countCondition = (savedAttendance: AttendanceEntity, condition: SchoolYearCondition): boolean => {
            return isWithinSchoolYearRange(savedAttendance.schoolYear, condition.schoolYearRange);
        }
        const conditionsWithCount = validator.getSchoolYearConditionsWithCount(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS, countCondition);

        // confirm that count has started at 0
        expect(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS[0].attendanceCount).toBe(0);
        expect(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS[1].attendanceCount).toBe(0);
        expect(MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS[3].attendanceCount).toBe(0);
        
        expect(conditionsWithCount[0].attendanceCount).toBe(1);
        expect(conditionsWithCount[1].attendanceCount).toBe(0);
        expect(conditionsWithCount[3].attendanceCount).toBe(1);
    })
})


describe("getSavedAttendancesWithUnsavedCurrent", () => {
    test("Should not modify savedAttendances", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        const currentAttendance: AttendanceEntity = {
            id: 1,
            schoolSubject: "music",
            schoolYear: "5",
            musicLessonTopic: "history",
            examinants: [{role: "music"}],
            schoolclassMode: null
        }
        const attendanceService = new AttendanceService();
        
        // falsy
        let validator = new MusicSchoolYearValidator(null, savedAttendances);
        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithUnsavedCurrent())).toBe(false);
        
        // falsy
        validator = new MusicSchoolYearValidator(currentAttendance, null);        
        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithUnsavedCurrent())).toBe(false);
    })

    test("Should add current to savedAttendances", () => {
        let savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolYear: "5",
                schoolSubject: "music",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: null
            }
        ];
        const currentAttendance: AttendanceEntity = {
            id: 1,
            schoolSubject: "music",
            schoolYear: "5",
            musicLessonTopic: "history",
            examinants: [{role: "music"}],
            schoolclassMode: null
        }
        const attendanceService = new AttendanceService();
        
        // with id
        let validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);
        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithUnsavedCurrent())).toBe(false);

        // without id
        currentAttendance.id = null;
        validator = new MusicSchoolYearValidator(currentAttendance, savedAttendances);
        expect(attendanceService.areModified(savedAttendances, validator.getSavedAttendancesWithUnsavedCurrent())).toBe(true);
    })
})


describe("shouldInputBeValidated", () => {

    const currentAttendance: AttendanceEntity = {
        id: 1,
        schoolSubject: "music",
        schoolYear: "5",
        examinants: [
            {
                role: "music"
            }
        ],
        schoolclassMode: null
    }
    const validator = new MusicSchoolYearValidator(currentAttendance, []);


    test("Check mock values", () => {
        expect(validator.shouldInputBeValidated("5")).toBe(true);
    })


    test("Should be true if is schoolyear", () => {
        expect(validator.shouldInputBeValidated(null)).toBe(false);
        expect(validator.shouldInputBeValidated("a" as SchoolYear)).toBe(false);
    })


    test("Should be true for matching subject only", () => {
        const clonedCurrentAttendance = cloneObj(currentAttendance);
        const validator = new MusicSchoolYearValidator(clonedCurrentAttendance, []);
        
        clonedCurrentAttendance.schoolSubject = "history";
        expect(validator.shouldInputBeValidated("5")).toBe(false);

        clonedCurrentAttendance.schoolSubject = "music";
        expect(validator.shouldInputBeValidated("5")).toBe(true);
    })


    test("Should be true for matching examinant", () => {
        const clonedCurrentAttendance = cloneObj(currentAttendance);
        const validator = new MusicSchoolYearValidator(clonedCurrentAttendance, []);
        
        clonedCurrentAttendance.examinants = [{role: "history"}];
        expect(validator.shouldInputBeValidated("5")).toBe(false);

        clonedCurrentAttendance.examinants = [{role: "music"}];
        expect(validator.shouldInputBeValidated("5")).toBe(true);
    })
})


// clone this before altering to avoid collisions between tests
const MOCK_MUSIC_SCHOOL_YEAR_CONDITIONS: SchoolYearCondition[] = [
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
        attendanceCount: 0
    },
    // Sekundarstufe 2 (sek2)
    {
        schoolYearRange: {
            min: "11",
            max: "13"
        },
        minAttendances: 4,
        maxAttendances: 5,
        attendanceCount: 0
    },
]

const MOCK_MUSIC_SCHOOL_YEAR_TOPIC_CONDITIONS: SchoolYearCondition[] = [
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
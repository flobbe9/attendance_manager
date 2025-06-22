import { AttendanceEntity } from "@/backend/DbSchema";
import { HistorySchoolYearValidator } from "../HistorySchoolYearValidator"
import { SchoolYear } from "@/abstract/SchoolYear";

describe("validateContextConditions", () => {
    test("Should not validate if schoolYear is falsy", () => {
        const currentAttendanceEntity: AttendanceEntity = {
            id: 1,
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: "language"
        }
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "5",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "sound"
            },
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            },
            // irrelevant attendances
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 6,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 7,
                schoolSubject: null,
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 8,
                schoolSubject: "history",
                schoolYear: null,
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ]
        const validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], null)).toBeNull();
        expect(validator.validateContextConditions([], undefined)).toBeNull();
        expect(validator.validateContextConditions([], "a" as SchoolYear)).toBeNull();
    });

    test("Variant 1 valid - should return null", () => {
        // can only be variant1
        const currentAttendanceEntity: AttendanceEntity = {
            id: 4,
            schoolSubject: "history",
            schoolYear: null,
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: "language"
        }
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "7",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            // irrelevant attendances
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 6,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 7,
                schoolSubject: null,
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 8,
                schoolSubject: "history",
                schoolYear: null,
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ]
        const validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], "10")).toBeNull();
    });

    test("Variant 2 valid - should return null", () => {
        // can only be variant1
        const currentAttendanceEntity: AttendanceEntity = {
            id: 4,
            schoolSubject: "history",
            schoolYear: "10",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: "language"
        }
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            // irrelevant attendances
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 6,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 7,
                schoolSubject: null,
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 8,
                schoolSubject: "history",
                schoolYear: null,
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ]
        const validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], currentAttendanceEntity.schoolYear)).toBeNull();
    });

    test("Need to mix variant 1 and 2 - should be invalid", () => {
        // can only be variant1
        const currentAttendanceEntity: AttendanceEntity = {
            id: 4,
            schoolSubject: "history",
            schoolYear: "10",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: "language"
        }
        // 10, 9, 7, 8 requires variant 1
        // 12, 13, 12 requires variant 2
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "7",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 11,
                schoolSubject: "history",
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 9,
                schoolSubject: "history",
                schoolYear: "13",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 10,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            // irrelevant attendances
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 6,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 7,
                schoolSubject: null,
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 8,
                schoolSubject: "history",
                schoolYear: null,
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ]
        const validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], currentAttendanceEntity.schoolYear)).not.toBeNull();
    });

    test("At least one Variant valid, validate gub", () => {
        // can only be variant1
        const currentAttendanceEntity: AttendanceEntity = {
            id: 4,
            schoolSubject: "history",
            schoolYear: "10",
            examinants: [{role: "history"}],
            schoolclassMode: null,
            musicLessonTopic: "language"
        }
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [
                    {
                        role: "history"
                    },
                    {
                        role: "educator"
                    },
                    {
                        role: "music"
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "rhythm"
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "9",
                examinants: [
                    {
                        role: "history"
                    },
                    {
                        role: "educator"
                    },
                    {
                        role: "music"
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            // irrelevant attendances
            {
                id: 5,
                schoolSubject: "music",
                schoolYear: "9",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 6,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [{role: "music"}],
                schoolclassMode: null,
                musicLessonTopic: "structure"
            },
            {
                id: 7,
                schoolSubject: null,
                schoolYear: "8",
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 8,
                schoolSubject: "history",
                schoolYear: null,
                examinants: [{role: "history"}],
                schoolclassMode: null,
                musicLessonTopic: "language"
            }
        ]
        let validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], currentAttendanceEntity.schoolYear)).toBeNull();

        // current is gubt but already maxed out
        currentAttendanceEntity.examinants = [
            {role: "history"},
            {role: "music"},
            {role: "educator"}
        ]
        validator = new HistorySchoolYearValidator(currentAttendanceEntity, savedAttendances);
        expect(validator.validateContextConditions([], currentAttendanceEntity.schoolYear)).not.toBeNull();
    });
})
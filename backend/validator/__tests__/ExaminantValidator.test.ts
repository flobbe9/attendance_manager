import { AttendanceEntity } from "../../entities/AttendanceEntity";
import { ExaminantValidator } from "../ExaminantValidator";

describe("validateGubs", () => {
    test("validateGubTotal - should be invalid if max num gubs is saved already", () => {
        const currentAttendance: AttendanceEntity = {
            id: 3,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [
                {
                    role: "music",
                },
                {
                    role: "educator",
                },
                {
                    role: "history",
                },
            ],
            schoolclassMode: null,
        };
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: currentAttendance.schoolSubject,
                schoolYear: currentAttendance.schoolYear,
                examinants: [
                    {
                        role: "music",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
            },
            {
                id: 4,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                ],
                schoolclassMode: null,
            },
        ];
        const validator = new ExaminantValidator(currentAttendance, savedAttendances);

        expect(validator.validateGubs()).not.toBeNull();

        // max not reached
        savedAttendances.splice(0, 1);
        expect(validator.validateGubs()).toBeNull();
    });

    test("validateGubTotal - should work regardless of topic or schoolyear", () => {
        const currentAttendance: AttendanceEntity = {
            id: 3,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [
                {
                    role: "music",
                },
                {
                    role: "educator",
                },
                {
                    role: "history",
                },
            ],
            schoolclassMode: null,
            musicLessonTopic: "history"
        };
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: currentAttendance.schoolSubject,
                schoolYear: currentAttendance.schoolYear,
                examinants: [
                    {
                        role: "music",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 4,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
        ];
        const validator = new ExaminantValidator(currentAttendance, savedAttendances);

        // max reached
        expect(validator.validateGubs()).not.toBeNull();

        currentAttendance.schoolYear = null;
        expect(validator.validateGubs()).not.toBeNull();
        currentAttendance.schoolYear = "5";

        currentAttendance.musicLessonTopic = null;
        expect(validator.validateGubs()).not.toBeNull();
        currentAttendance.musicLessonTopic = "history";

        // max not reached
        savedAttendances.splice(0, 1);
        expect(validator.validateGubs()).toBeNull();

        currentAttendance.schoolYear = null;
        expect(validator.validateGubs()).toBeNull();
        currentAttendance.schoolYear = "5";

        currentAttendance.musicLessonTopic = null;
        expect(validator.validateGubs()).toBeNull();
        currentAttendance.musicLessonTopic = "history";
    });

    test("validateGubSubjectSchoolYearConditions - should be invalid if same gub subject is saved already", () => {
        const currentAttendance: AttendanceEntity = {
            id: 3,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [
                {
                    role: "music",
                },
                {
                    role: "educator",
                },
                {
                    role: "history",
                },
            ],
            schoolclassMode: null,
            musicLessonTopic: "history"
        };
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music", // same as current
                schoolYear: "12", // not the same year condition
                examinants: [
                    {
                        role: "music",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 4,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
        ];
        let validator = new ExaminantValidator(
            currentAttendance,
            savedAttendances
        );

        expect(validator.validateGubs()).not.toBeNull();

        // different subject
        currentAttendance.schoolSubject = "history";
        expect(validator.validateGubs()).toBeNull();
    });

    test("validateGubSubjectSchoolYearConditions - should work regardless of topic or schoolyear", () => {
        const currentAttendance: AttendanceEntity = {
            id: 3,
            schoolSubject: "music",
            schoolYear: "5",
            examinants: [
                {
                    role: "music",
                },
                {
                    role: "educator",
                },
                {
                    role: "history",
                },
            ],
            schoolclassMode: null,
            musicLessonTopic: "history"
        };
        const savedAttendances: AttendanceEntity[] = [
            {
                id: 1,
                schoolSubject: "music", // same as current
                schoolYear: "12", // not the same year condition
                examinants: [
                    {
                        role: "music",
                    },
                    {
                        role: "educator",
                    },
                    {
                        role: "history",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
            {
                id: 4,
                schoolSubject: "history",
                schoolYear: "12",
                examinants: [
                    {
                        role: "history",
                    },
                    {
                        role: "educator",
                    },
                ],
                schoolclassMode: null,
                musicLessonTopic: "history"
            },
        ];
        let validator = new ExaminantValidator(
            currentAttendance,
            savedAttendances
        );

        expect(validator.validateGubs()).not.toBeNull();
        currentAttendance.schoolYear = null;
        expect(validator.validateGubs()).not.toBeNull();
        currentAttendance.schoolYear = "5";

        currentAttendance.musicLessonTopic = null;
        expect(validator.validateGubs()).not.toBeNull();
        currentAttendance.musicLessonTopic = "history";

        // different subject
        currentAttendance.schoolSubject = "history";
        expect(validator.validateGubs()).toBeNull();

        currentAttendance.schoolYear = null;
        expect(validator.validateGubs()).toBeNull();
        currentAttendance.schoolYear = "5";

        currentAttendance.musicLessonTopic = null;
        expect(validator.validateGubs()).toBeNull();
        currentAttendance.musicLessonTopic = "history";
    });
})
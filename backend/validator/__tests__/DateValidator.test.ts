import { AttendanceEntity } from "@/backend/DbSchema"
import { DateValidator } from "../DateValidator"
import { dateEquals } from "@/utils/utils"

describe("validateContextConditions", () => {
    test("Should not validate", () => {
        const currentAttendanceEntity: AttendanceEntity = {
            id: 1,
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [
                {
                    role: "history"
                }
            ],
            schoolclassMode: null,
            musicLessonTopic: null,
            date: null
        }

        const savedAttendances: AttendanceEntity[] = [
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "5",
                examinants: [
                    {
                        role: "history"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: new Date()
            },
            {
                id: 2,
                schoolSubject: "history",
                schoolYear: "10",
                examinants: [
                    {
                        role: "music"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: new Date()
            }
        ]
        const validator = new DateValidator(currentAttendanceEntity, savedAttendances);

        // falsy date
        expect(currentAttendanceEntity.date).toBeFalsy();
        expect(currentAttendanceEntity.examinants.length).toBeGreaterThan(0);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();

        currentAttendanceEntity.examinants = [];
        currentAttendanceEntity.date = new Date();

        // no examinants selected
        expect(currentAttendanceEntity.date).toBeTruthy();
        expect(currentAttendanceEntity.examinants.length).toBe(0);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();

        currentAttendanceEntity.examinants = null;
        expect(currentAttendanceEntity.examinants).toBeFalsy();
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();
    })

    test("Should be valid if no examinants planned more than once", () => {
        const conflictDate = new Date();
        const nonConflictDate = new Date(0);

        const currentAttendanceEntity: AttendanceEntity = {
            id: 1,
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [
                {
                    role: "history",
                    fullName: "jose"
                }
            ],
            schoolclassMode: null,
            musicLessonTopic: null,
            date: nonConflictDate
        }

        const savedAttendances: AttendanceEntity[] = [
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "5",
                examinants: [
                    {
                        role: "history",
                        fullName: "jose"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: conflictDate
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "10",
                examinants: [
                    {
                        role: "music",
                        fullName: "peter"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: conflictDate
            }
        ]
        const validator = new DateValidator(currentAttendanceEntity, savedAttendances);

        // different date
        expect(currentAttendanceEntity.examinants.length).toBeGreaterThan(0);
        expect(currentAttendanceEntity.date).toBeTruthy();
        expect(savedAttendances[0].examinants.length).toBeGreaterThan(0);
        expect(savedAttendances[1].examinants.length).toBeGreaterThan(0);
        expect(dateEquals(currentAttendanceEntity.date, savedAttendances[0].date)).toBe(false);
        expect(dateEquals(currentAttendanceEntity.date, savedAttendances[1].date)).toBe(false);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();

        // conflict date but no examiants selected
        currentAttendanceEntity.examinants = [];
        currentAttendanceEntity.date = conflictDate;

        expect(currentAttendanceEntity.examinants.length).toBe(0);
        expect(dateEquals(currentAttendanceEntity.date, conflictDate)).toBe(true);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();

        // conflict date but different examinants selected
        currentAttendanceEntity.examinants = [{role: "educator"}];
        currentAttendanceEntity.date = conflictDate;

        expect(currentAttendanceEntity.examinants.length).toBeGreaterThan(0);
        expect(dateEquals(currentAttendanceEntity.date, conflictDate)).toBe(true);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();

        // reset
        currentAttendanceEntity.examinants = [
            {role: "history"}
        ];
        currentAttendanceEntity.date = nonConflictDate;
        expect(currentAttendanceEntity.examinants.length).toBeGreaterThan(0);
        expect(dateEquals(currentAttendanceEntity.date, nonConflictDate)).toBe(true);

        // no examinants saved
        savedAttendances
            .forEach(savedAttendance => savedAttendance.examinants = []);

        expect(savedAttendances[0].examinants.length).toBe(0);
        expect(savedAttendances[1].examinants.length).toBe(0);
        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();
    })

    test("Should be invalid if same examinant is planned more than once", () => {
        const conflictDate = new Date();
        const nonConflictDate = new Date(0);

        const currentAttendanceEntity: AttendanceEntity = {
            id: 1,
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [
                {
                    role: "history",
                    fullName: "jose"
                }
            ],
            schoolclassMode: null,
            musicLessonTopic: null,
            date: conflictDate
        }

        const savedAttendances: AttendanceEntity[] = [
            {
                id: 3,
                schoolSubject: "history",
                schoolYear: "5",
                examinants: [
                    {
                        role: "history",
                        fullName: "jose"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: conflictDate
            },
            {
                id: 2,
                schoolSubject: "music",
                schoolYear: "10",
                examinants: [
                    {
                        role: "music",
                        fullName: "peter"
                    }
                ],
                schoolclassMode: null,
                musicLessonTopic: null,
                date: conflictDate
            }
        ]
        const validator = new DateValidator(currentAttendanceEntity, savedAttendances);

        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).not.toBeNull();

        currentAttendanceEntity.id = null;

        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).not.toBeNull();

        // remove conflict attendance
        savedAttendances[0].date = null;

        expect(validator.validateContextConditions([], currentAttendanceEntity.date)).toBeNull();        
    })
})
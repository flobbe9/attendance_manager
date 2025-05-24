import { AttendanceEntity, ExaminantEntity, SchoolclassModeEntity } from "@/backend/DbSchema";
import { ExaminantService } from "../ExaminantService";
import { AttendanceService } from "../AttendanceService";
import { SchoolclassModeService } from "../SchoolclassModeService";


describe('isModified', () => {
    const attendanceService = new AttendanceService();
    
    test('basic comparison by id', () => { 
        const examinant1: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        }
        const examinant2: ExaminantEntity = {
            id: 1, 
            role: "history",
            attendanceId: 2,
            fullName: "name",
        }

        const schoolclassMode1: SchoolclassModeEntity = {
            id: 1,
            mode: "ownClass",
            attendanceId: 1,
            fullName: "name",
        }

        const attendance1: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [examinant2, examinant1],
            schoolclassMode: schoolclassMode1,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)    
        }
        const attendance2: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [examinant1, examinant2] ,
            schoolclassMode: schoolclassMode1,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)
        } 
        
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        expect(attendanceService.isModified(attendance1, attendance1)).toBe(false);
    })
    
    test('should be true if at least one field is modified', () => { 
        const examinant1: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        }
        const examinant2: ExaminantEntity = {
            id: 1, 
            role: "history",
            attendanceId: 1,
            fullName: "name",
        }

        const schoolclassMode1: SchoolclassModeEntity = {
            id: 1,
            mode: "ownClass",
            attendanceId: 1,
            fullName: "name",
        }
        const schoolclassMode2: SchoolclassModeEntity = {
            id: 1, 
            mode: "ownClass",
            attendanceId: 1,
            fullName: "name",
        }

        const attendance1: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [examinant1, examinant2],
            schoolclassMode: schoolclassMode1,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)    
        }
        const attendance2: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [examinant1, examinant2] ,
            schoolclassMode: schoolclassMode2,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)
        } 
        
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
        
        attendance2.id = 2;
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.id = 1;
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        attendance2.schoolSubject = "music";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.schoolSubject = "history";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        attendance2.schoolYear = "6";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.schoolYear = "5";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        attendance2.note = "note11";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.note = "note1";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
        
        attendance2.note2 = "note22";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.note2 = "note2";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
                
        attendance2.musicLessonTopic = "rhythm";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.musicLessonTopic = "history";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
        
        attendance2.date = new Date();
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.date = new Date(0);
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        // examinant field
        attendance2.examinants = [
            examinant1,
            {
                id: 0, // altered id
                role: examinant2.role,
                attendanceId: examinant2.attendanceId,
                fullName: examinant2.fullName,
            }
        ]
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.examinants = [examinant1, examinant2];
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
        
        // examinants length
        attendance2.examinants = [examinant1];
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.examinants = [examinant1, examinant2];
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
                
        // examinants order
        examinant2.id = 0;
        attendance2.examinants = [examinant2, examinant1];
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        attendance2.examinants = [examinant1, examinant2];
        examinant2.id = 1;
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        schoolclassMode2.fullName = "namee";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
        schoolclassMode2.fullName = "name";
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
    })

    test("should compare date only by days, not by time", () => {
        const attendance1: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [],
            schoolclassMode: undefined,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)    
        }
        const attendance2: AttendanceEntity = {
            schoolSubject: "history",
            schoolYear: "5",
            examinants: [] ,
            schoolclassMode: undefined,
            id: 1,
            note: "note1",
            note2: "note2",
            musicLessonTopic: "history",
            date: new Date(0)
        } 

        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);

        attendance2.date = new Date(1); // one more second
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(false);
        attendance2.date = new Date(60 * 60 * 24) // one more day
        expect(attendanceService.isModified(attendance1, attendance2)).toBe(true);
    })
})
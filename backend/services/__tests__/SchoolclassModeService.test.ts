import { SchoolclassModeEntity } from "@/backend/DbSchema";
import { SchoolclassModeService } from "../SchoolclassModeService";


describe('isModified', () => {
    const schoolclassModeService = new SchoolclassModeService();
    
    test('basic comparison by id', () => { 
        const schoolclassMode1: SchoolclassModeEntity = {
            id: 1,
            mode: "ownClass",
            attendanceId: 1,
            fullName: "name",
        }
        const schoolclassMode2: SchoolclassModeEntity = {
            id: 1, 
            mode: "ownClass",
            attendanceId: 2,
            fullName: "name",
        }
        
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(true);
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode1)).toBe(false);
    })
    
    test('should be true if at least one field is modified', () => { 
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
        
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(false);
        
        schoolclassMode2.mode = "othersClass";
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(true);
        schoolclassMode2.mode = "ownClass";
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(false);
        
        schoolclassMode2.attendanceId = 2;
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(true);
        schoolclassMode2.attendanceId = 1;
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(false);

        schoolclassMode2.fullName = "namee";
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(true);
        schoolclassMode2.fullName = "name";
        expect(schoolclassModeService.isModified(schoolclassMode1, schoolclassMode2)).toBe(false);
    })
})
import { ExaminantEntity } from "@/backend/DbSchema";
import { ExaminantService } from "../ExaminantService";


describe('isModified', () => {
    const examinantService = new ExaminantService();
    
    test('basic comparison by id', () => { 
        const examinant1: ExaminantEntity = {
            id: 1,
            role: "history",
            attendanceId: 1,
            fullName: "name",
        }
        const examinant2: ExaminantEntity = {
            id: 2, 
            role: "history",
            attendanceId: 1,
            fullName: "name",
        }
        
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        expect(examinantService.isModified(examinant1, examinant1)).toBe(false);
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
        
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);
        
        examinant2.id = 2;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.id = 1;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);

        examinant2.role = "music";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.role = "history";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);
        
        examinant2.attendanceId = 2;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.attendanceId = 1;
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);

        examinant2.fullName = "namee";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(true);
        examinant2.fullName = "name";
        expect(examinantService.isModified(examinant1, examinant2)).toBe(false);
    })
})
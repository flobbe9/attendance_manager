import { dateEquals } from "@/utils/utils";
import { AbstractService } from "../abstract/AbstractService";
import { AttendanceEntity } from "../DbSchema";
import { ExaminantService } from "./ExaminantService";
import { SchoolclassModeService } from "./SchoolclassModeService";


/**
 * @since 0.0.1
 */
export class AttendanceService extends AbstractService<AttendanceEntity> {
    
    // TODO: write tests for this
    public isModified(entityLastSaved: AttendanceEntity, entityModified: AttendanceEntity): boolean {

        if (!entityLastSaved)
            return !!entityModified;

        if (!entityModified)
            return true;

        const examinantService = new ExaminantService();
        const schoolclassModeService = new SchoolclassModeService();

        return entityLastSaved.id !== entityModified.id || 
            !dateEquals(entityLastSaved.date, entityModified.date) || 
            entityLastSaved.schoolSubject !== entityModified.schoolSubject || 
            entityLastSaved.schoolYear !== entityModified.schoolYear || 
            entityLastSaved.musicLessonTopic !== entityModified.musicLessonTopic || 
            entityLastSaved.note !== entityModified.note || 
            entityLastSaved.note2 !== entityModified.note2  ||
            examinantService.areModified(entityLastSaved.examinants, entityModified.examinants) ||
            schoolclassModeService.isModified(entityLastSaved.schoolclassMode, entityModified.schoolclassMode);
    }
}
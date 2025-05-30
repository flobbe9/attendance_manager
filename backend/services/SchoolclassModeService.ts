import { AbstractModifiableService } from "../abstract/AbstractModifiableService";
import { SchoolclassModeEntity } from "../DbSchema";


/**
 * @since 0.0.1
 */
export class SchoolclassModeService extends AbstractModifiableService<SchoolclassModeEntity> {
    
    public isModified(entityLastSaved: SchoolclassModeEntity, entityModified: SchoolclassModeEntity): boolean {
        
        if (!entityLastSaved)
            return !!entityModified;

        if (!entityModified)
            return true;

        return entityLastSaved.mode !== entityModified.mode ||
            entityLastSaved.fullName !== entityModified.fullName ||
            entityLastSaved.attendanceId !== entityModified.attendanceId;
    }
}
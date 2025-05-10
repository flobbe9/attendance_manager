import AbstractEntity from "../abstract/Abstract_Schema";
import { AbstractService } from "../abstract/AbstractService";
import { AttendanceEntity } from "../DbSchema";


/**
 * @since latest
 */
export class AttendanceService extends AbstractService<AttendanceEntity> {
    
    isTypeOfEntity(entity: AbstractEntity): entity is AttendanceEntity {

        return !!entity && 
            Object.hasOwn(entity, "schoolSubject") && 
            Object.hasOwn(entity, "schoolYear");
    }
}
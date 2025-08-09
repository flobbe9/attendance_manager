import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { FilterWrapper } from "./FilterWrapper";

/**
 * @since latest
 */
export class AttendanceFilterWrapper extends FilterWrapper<AttendanceEntity> {
    classField: keyof AttendanceEntity;

    constructor(filterValue: string | number, classField: keyof AttendanceEntity) {
        super(filterValue);
        this.classField = classField;
    }

    filter(obj: AttendanceEntity): boolean {
        return this.filterValue === obj[this.classField];
    }
}
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { FilterWrapper } from "./FilterWrapper";

/**
 * @since 0.2.4
 */
export interface AttendanceFilterWrapper extends FilterWrapper{
    classField: keyof AttendanceEntity;
}
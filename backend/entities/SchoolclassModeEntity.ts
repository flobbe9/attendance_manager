import { SchoolclassMode_Key } from "@/abstract/SchoolclassMode";
import AbstractEntity from "../abstract/AbstractEntity";

/**
 * @since 0.0.1
 * @see SchoolclassMode
 */
export class SchoolclassModeEntity extends AbstractEntity {
    mode: SchoolclassMode_Key;
    /** Name of the teacher responsible for the attended class in case the mode is not "ownClass" */
    fullName?: string;
    attendanceId?: number;
}

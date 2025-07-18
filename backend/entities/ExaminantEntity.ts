import { ExaminantRole_Key } from "@/abstract/Examinant";
import AbstractEntity from "../abstract/Abstract_Schema";

/**
 * @since 0.0.1
 */
export class ExaminantEntity extends AbstractEntity {
    /** The type of examinant. See {@link Examinant} */
    role: ExaminantRole_Key;
    fullName?: string;
    attendanceId?: number;

    constructor(role: ExaminantRole_Key) {
        super();
        this.role = role;
    }
}

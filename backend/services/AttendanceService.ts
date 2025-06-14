import { ExaminantRole_Key } from "@/abstract/Examinant";
import { PartialRecord } from "@/abstract/PartialRecord";
import { defaultEqualsFalsy } from "@/utils/projectUtils";
import { assertFalsyAndThrow, dateEquals } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AbstractModifiableService } from "../abstract/AbstractModifiableService";
import { AttendanceEntity, ExaminantEntity } from "../DbSchema";
import { ExaminantService } from "./ExaminantService";
import { SchoolclassModeService } from "./SchoolclassModeService";


/**
 * @since 0.0.1
 */
export class AttendanceService extends AbstractModifiableService<AttendanceEntity> {

    public isModified(entityLastSaved: AttendanceEntity, entityModified: AttendanceEntity): boolean {

        const equalsFalsy = defaultEqualsFalsy(entityLastSaved, entityModified);
        if (equalsFalsy !== null)
            return equalsFalsy;

        const examinantService = new ExaminantService();
        const schoolclassModeService = new SchoolclassModeService();

        return !dateEquals(entityLastSaved.date, entityModified.date) || 
            entityLastSaved.schoolSubject !== entityModified.schoolSubject || 
            entityLastSaved.schoolYear !== entityModified.schoolYear || 
            entityLastSaved.musicLessonTopic !== entityModified.musicLessonTopic || 
            entityLastSaved.note !== entityModified.note || 
            entityLastSaved.note2 !== entityModified.note2  ||
            examinantService.areModified(entityLastSaved.examinants, entityModified.examinants) ||
            schoolclassModeService.isModified(entityLastSaved.schoolclassMode, entityModified.schoolclassMode);
    }


    /**
     * @param attendanceEntity to get examinant from
     * @param role of the searched examinant
     * @returns `[examinant, examinantIndex]` of first ocurrence with `role` or `[null, -1]`
     * @throws if params are falsy
     */
    public getExaminantByRole(attendanceEntity: AttendanceEntity, role: ExaminantRole_Key): [ExaminantEntity | null, number] | undefined {

        assertFalsyAndThrow(attendanceEntity, role);

        if (!attendanceEntity.examinants)
            return;

        let examinantIndex = -1;
        const examinant = attendanceEntity.examinants
            .find((examinant, i) => {
                if (examinant.role === role) {
                    examinantIndex = i;
                    return true;
                }
                
                return false;
            });

        return examinant ? [examinant, examinantIndex] : [null, -1];
    }


    /**
     * @param attendanceEntity to check for examinant
     * @param role of the searched examinant
     * @returns `true` if `attendanceEntity.examinants` has at least one examinant with given role, `false`
     * if not or `attendanceEntity.examinants` is falsy. 
     * @throws if params are falsy
     */
    public hasExaminant(attendanceEntity: AttendanceEntity, role: ExaminantRole_Key): boolean {

        assertFalsyAndThrow(attendanceEntity, role);

        return !!this.getExaminantByRole(attendanceEntity, role)[0];
    }


    /**
     * Call {@link addOrUpdateExaminantByRole} with a new examinant object but only if `attendanceEntity` does not have an examinant
     * with `role` yet.
     * 
     * @see {@link addOrUpdateExaminantByRole}
     * @throws if params are falsy
     */
    public addExaminantByRole(attendanceEntity: AttendanceEntity, role: ExaminantRole_Key): AttendanceEntity {

        assertFalsyAndThrow(attendanceEntity, role);

        if (this.hasExaminant(attendanceEntity, role))
            return attendanceEntity;

        return this.addOrUpdateExaminantByRole(attendanceEntity, {role: role, fullName: null, attendanceId: null});
    }

    
    /**
     * Push a new examinant to `attendanceEntity` or update examinant if exists by role. 
     * Also mind `attendanceEntity.examinants` possibly beeing `undefined`.
     *  
     * @param attendanceEntity to add examinant to
     * @param examinant to add
     * @returns the updated `attendanceEntity`
     * @throws if params are falsy
     */
    public addOrUpdateExaminantByRole(attendanceEntity: AttendanceEntity, examinant: ExaminantEntity): AttendanceEntity {

        assertFalsyAndThrow(attendanceEntity, examinant);

        // case: examinants not set yet
        if (!attendanceEntity.examinants)
            attendanceEntity.examinants = [];

        // case: update 
        if (this.hasExaminant(attendanceEntity, examinant.role))
            this.removeExaminant(attendanceEntity, examinant.role);
        
        attendanceEntity.examinants.push(examinant);

        return attendanceEntity;
    }


    /**
     * Remove examinant from `attendanceEntity` if it exists by `role`.
     *  
     * @param attendanceEntity to add examinant to
     * @param role type of examinant to remove
     * @returns the removed examinant or `undefined`
     * @throws if params are falsy
     */
    public removeExaminant(attendanceEntity: AttendanceEntity, role: ExaminantRole_Key): ExaminantEntity | undefined {

        assertFalsyAndThrow(attendanceEntity, role);

        // find examinant by role
        let [examinantToDelete, examinantToDeleteIndex] = this.getExaminantByRole(attendanceEntity, role);

        // case: found examinant to delete
        if (examinantToDelete) {
            attendanceEntity.examinants.splice(examinantToDeleteIndex, 1);
            return examinantToDelete;
        }

        return undefined;
    }


    /**
     * @param fields to possibly override or just add to "empty" instance
     * @returns new object (not actually instantiated) with only required fields and `fields`
     */
    public static getEmptyInstance(fields?: PartialRecord<keyof AttendanceEntity, ValueOf<AttendanceEntity>>): AttendanceEntity {

        return {
            schoolSubject: undefined,
            schoolclassMode: {
                mode: "ownClass"
            },
            examinants: [],
            schoolYear: undefined,
            ...(fields as any ?? {}) // cannot infer that key matches value
        }
    }


    public findAllByExaminant(attendanceEntities: AttendanceEntity[], role: ExaminantRole_Key): AttendanceEntity[] {

        assertFalsyAndThrow(attendanceEntities, role);

        return attendanceEntities
            .filter(attendanceEntitiy =>
                this.hasExaminant(attendanceEntitiy, role));
    }
}
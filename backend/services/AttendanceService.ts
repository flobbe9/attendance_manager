import { ExaminantRole_Key } from "@/abstract/Examinant";
import { PartialRecord } from "@/abstract/PartialRecord";
import { SchoolSubject_Key, schoolSubjectKeysObj } from "@/abstract/SchoolSubject";
import { SortOrder } from "@/abstract/SortOrder";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { defaultEqualsFalsy } from "@/utils/projectUtils";
import { assertFalsyAndThrow, dateEquals, isBlank, isDateAfter } from "@/utils/utils";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { AbstractModifiableService } from "../abstract/AbstractModifiableService";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { ExaminantEntity } from "../entities/ExaminantEntity";
import { ExaminantService } from "./ExaminantService";
import { SchoolclassModeService } from "./SchoolclassModeService";

/**
 * @since 0.0.1
 */
export class AttendanceService extends AbstractModifiableService<AttendanceEntity> {
    public isModified(entityLastSaved: AttendanceEntity, entityModified: AttendanceEntity): boolean {
        const equalsFalsy = defaultEqualsFalsy(entityLastSaved, entityModified);
        if (equalsFalsy !== null) return equalsFalsy;

        const examinantService = new ExaminantService();
        const schoolclassModeService = new SchoolclassModeService();

        return (
            !dateEquals(entityLastSaved.date, entityModified.date) ||
            entityLastSaved.schoolSubject !== entityModified.schoolSubject ||
            entityLastSaved.schoolYear !== entityModified.schoolYear ||
            entityLastSaved.musicLessonTopic !== entityModified.musicLessonTopic ||
            entityLastSaved.note !== entityModified.note ||
            entityLastSaved.note2 !== entityModified.note2 ||
            examinantService.areModified(entityLastSaved.examinants, entityModified.examinants) ||
            schoolclassModeService.isModified(entityLastSaved.schoolclassMode, entityModified.schoolclassMode)
        );
    }

    /**
     * @returns `[examinant, examinantIndex]` of first ocurrence with `role` or `[null, -1]`
     * @throws if params are falsy
     * @see `ExaminantService.findExaminant`
     */
    public getExaminantByRole(attendanceEntity: AttendanceEntity, role: ExaminantRole_Key): [ExaminantEntity | null, number] | undefined {
        assertFalsyAndThrow(attendanceEntity, role);

        if (!attendanceEntity.examinants) return [null, -1];

        return new ExaminantService().findExaminant(attendanceEntity.examinants, role);
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

        if (this.hasExaminant(attendanceEntity, role)) return attendanceEntity;

        return this.addOrUpdateExaminantByRole(attendanceEntity, {
            role: role,
            fullName: null,
            attendanceId: null,
        });
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
        if (!attendanceEntity.examinants) attendanceEntity.examinants = [];

        // case: update
        if (this.hasExaminant(attendanceEntity, examinant.role)) this.removeExaminant(attendanceEntity, examinant.role);

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
                mode: "ownClass",
            },
            examinants: [],
            schoolYear: undefined,
            ...((fields as any) ?? {}), // cannot infer that key matches value
        };
    }

    public findAllByExaminant(attendanceEntities: AttendanceEntity[], role: ExaminantRole_Key): AttendanceEntity[] {
        assertFalsyAndThrow(attendanceEntities, role);

        return attendanceEntities.filter((attendanceEntitiy) => this.hasExaminant(attendanceEntitiy, role));
    }

    /**
     * @param attendanceEntities to search through
     * @param roleAndSchoolSubject `schoolSubject` to match attendances with
     * @returns filtered list of `attendanceEntities` that have both and examinant with role `roleAndSchoolSubject` and
     * `schoolSubject` that equals `roleAndSchoolSubject`
     */
    public findAllByExaminantAndSchoolSubject(attendanceEntities: AttendanceEntity[], roleAndSchoolSubject: SchoolSubject_Key): AttendanceEntity[] {
        assertFalsyAndThrow(attendanceEntities, roleAndSchoolSubject);

        return this.findAllByExaminant(attendanceEntities, roleAndSchoolSubject).filter(
            (attendanceEntity) => attendanceEntity.schoolSubject === roleAndSchoolSubject
        );
    }

    /**
     * @param attendanceEntity to check
     * @returns `true` if `attendanceEntity` is considered a gub
     * @throws if falsy param
     */
    public isGub(attendanceEntity: AttendanceEntity): boolean {
        assertFalsyAndThrow(attendanceEntity);

        if (!attendanceEntity.examinants) return false;

        return (
            this.hasExaminant(attendanceEntity, "educator") &&
            this.hasExaminant(attendanceEntity, "history") &&
            this.hasExaminant(attendanceEntity, "music")
        );
    }

    /**
     * Indicates whether `value` can be considered "filled out". In other words, if `value` is not "unselected" or blank.
     *
     * @param value of the select input
     * @param noSelectionLabel to consider as "unselected". Default is {@link NO_SELECTION_LABEL}
     * @returns `true` if `value` equals the {@link NO_SELECTION_LABEL} or is blank
     */
    public isSelectInputFilledOut(value: string, noSelectionLabel = NO_SELECTION_LABEL): boolean {
        return !(value === noSelectionLabel || isBlank(value));
    }

    /**
     * Sort by `schoolSubjectKeysObj` index.
     *
     * @param attendanceEntity1
     * @param attendanceEntity2
     * @param sortOrder
     * @returns negative value if `attendanceEntity1` should come before `attendanceEntity2`
     */
    public compareSchoolSubject(
        attendanceEntity1: AttendanceEntity,
        attendanceEntity2: AttendanceEntity,
        sortOrder: SortOrder = SortOrder.ASC
    ): number {
        const compareValue =
            schoolSubjectKeysObj[attendanceEntity1.schoolSubject].index - schoolSubjectKeysObj[attendanceEntity2.schoolSubject].index;

        return sortOrder === SortOrder.DESC ? compareValue * -1 : compareValue;
    }

    /**
     * Sort by `date` asc.
     *
     * Consider a falsy date "later" than a truthy one.
     *
     * @param attendanceEntity1
     * @param attendanceEntity2
     * @param sortOrder
     * @returns negative value if `attendanceEntity1` should come before `attendanceEntity2`
     */
    public compareDate(attendanceEntity1: AttendanceEntity, attendanceEntity2: AttendanceEntity, sortOrder: SortOrder = SortOrder.ASC): number {
        let compareValue: number;

        // falsy date
        if (!attendanceEntity2.date && !attendanceEntity1.date) compareValue = 0;

        if (!attendanceEntity1.date) compareValue = 1;
        else if (!attendanceEntity2.date) compareValue = -1;
        // normal asc
        else compareValue = attendanceEntity1.date.getTime() - attendanceEntity2.date.getTime();

        return sortOrder === SortOrder.DESC ? compareValue * -1 : compareValue;
    }
    
    /**
     * @param attendanceEntity to check the `date` for
     * @returns `true` if `attendanceEntity.date` is tomorrow or later (ignore time), `false` if is today, in the past or falsy
     * @throw if args is falsy
     */
    public isFutureAttendance(attendanceEntity: AttendanceEntity): boolean {
        assertFalsyAndThrow(attendanceEntity);

        return !attendanceEntity.date || isDateAfter(attendanceEntity.date, new Date());
    }
}

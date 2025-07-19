import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Cascade } from "../abstract/Cascade";
import { Db } from "../abstract/Db";
import { EntityRelationType } from "../abstract/EntityRelationType";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { AttendanceEntity } from "../entities/AttendanceEntity";
import { Attendance_Table } from "../schemas/AttendanceSchema";
import { ExaminantRepository } from "./ExaminantRepository";
import { SchoolclassModeRepository } from "./SchoolclassModeRepository";
import AbstractEntity from "../abstract/AbstractEntity";

/**
 * @since 0.0.1
 */
export class AttendanceRepository extends AbstractRepository<AttendanceEntity> {
    constructor(db: Db, sqliteDb: SQLiteDatabase) {
        super(db, sqliteDb, Attendance_Table);
    }

    getBackReferenceColumnName(): string {
        return "attendanceId";
    }

    getOwnedEntities(entity?: AttendanceEntity): RelatedEntityDetail<AttendanceEntity, any>[] {
        const relatedEntities: RelatedEntityDetail<AttendanceEntity, any>[] = [];

        relatedEntities.push({
            repository: new ExaminantRepository(this.db, this.sqliteDb),
            column: {
                name: "examinants",
                value: entity?.examinants,
            },
            relationType: EntityRelationType.ONE_TO_MANY,
            cascade: new Set([Cascade.INSERT, Cascade.UPDATE]),
            orphanRemoval: true,
        });

        relatedEntities.push({
            repository: new SchoolclassModeRepository(this.db, this.sqliteDb),
            column: {
                name: "schoolclassMode",
                value: entity?.schoolclassMode,
            },
            relationType: EntityRelationType.ONE_TO_ONE,
            cascade: new Set([Cascade.UPDATE]),
            orphanRemoval: true,
        });

        return relatedEntities;
    }
}

import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { Attendance_Table, Examinant_Table, ExaminantEntity } from "../DbSchema";


/**
 * @since 0.0.1
 */
export class ExaminantRepository extends AbstractRepository<ExaminantEntity> {
        
    constructor(db: Db, sqliteDb: SQLiteDatabase) {

        super(db, sqliteDb, Examinant_Table);
    }
        
    getBackReferenceColumnName(): string {

        return "examinantId";
    }

    
    getOwnedEntities(_entity: ExaminantEntity): RelatedEntityDetail<ExaminantEntity, any>[] {

        // owns no entities
        
        return [];
    }
}
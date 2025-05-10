import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { SchoolclassMode_Table, SchoolclassModeEntity } from "../DbSchema";


/**
 * @since 0.0.1
 */
export class SchoolclassModeRepository extends AbstractRepository<SchoolclassModeEntity> {
        
    constructor(db: Db, sqliteDb: SQLiteDatabase) {

        super(db, sqliteDb, SchoolclassMode_Table);
    }
        
    getBackReferenceColumnName(): string {

        return "schoolclassModeId";
    }

    
    getOwnedEntities(_entity: SchoolclassModeEntity): RelatedEntityDetail<SchoolclassModeEntity, any>[] {

        // owns no entities
        
        return [];
    }
}
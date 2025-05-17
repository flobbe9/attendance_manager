import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { SchoolclassMode_Table, SchoolclassModeEntity, Test_Table, TestEntity } from "../DbSchema";


/**
 * @since 0.0.1
 */
export class TestRepository extends AbstractRepository<TestEntity> {
        
    constructor(db: Db, sqliteDb: SQLiteDatabase) {

        super(db, sqliteDb, Test_Table);
    }
        
    getBackReferenceColumnName(): string {

        return "testId";
    }

    
    getOwnedEntities(_entity: TestEntity): RelatedEntityDetail<TestEntity, any>[] {

        // owns no entities
        return []
    }
}
import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { SchoolclassMode_Table, SchoolclassModeEntity } from "../DbSchema";
import { TestRepository } from "./TestRepository";
import { EntityRelationType } from "../abstract/EntityRelationType";


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

    
    getOwnedEntities(entity: SchoolclassModeEntity): RelatedEntityDetail<SchoolclassModeEntity, any>[] {

        return [{
            repository: new TestRepository(this.db, this.sqliteDb),
            column: {
                name: "test",
                value: entity?.test
            },
            relationType: EntityRelationType.ONE_TO_ONE
        }];
    }
}
import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { Examinant_Table, ExaminantEntity } from "../DbSchema";
import { ExaminantRole_Key } from "@/abstract/Examinant";
import { assertFalsyAndLog } from "@/utils/utils";
import { eq } from "drizzle-orm";


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


    /**
     * @param role of the examinant
     * @returns all examinants with `role`, an empty array if no results or `null` if error
     */
    async loadByRole(role: ExaminantRole_Key): Promise<ExaminantEntity[]> {

        if (!assertFalsyAndLog(role))
            return;

        return await this.select(eq(this.table.role, role));
    }


    async countByRole(role: ExaminantRole_Key): Promise<number | null> {

        return this.count(eq(this.table.role, role));
    }
}
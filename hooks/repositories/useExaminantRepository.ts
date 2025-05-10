import { Examinant_Table, ExaminantEntity } from "@/backend/DbSchema";
import { ExaminantRepository } from "@/backend/repositories/ExaminantRepository";
import { useDao } from "@/backend/useDao";


/**
 * @returns all default db instances as well as the entity specific repository
 * @since 0.0.1
 */
export function useExaminantRepository() {

    const { dao, db, sqliteDb } = useDao<ExaminantEntity>(Examinant_Table);
    const examinantRepository = new ExaminantRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        examinantRepository
    }
}
import {SchoolclassModeRepository} from "@/backend/repositories/SchoolclassModeRepository";
import {useDao} from "@/backend/useDao";
import { SchoolclassMode_Table } from "@/backend/schemas/SchoolclassModeSchema";
import { SchoolclassModeEntity } from "@/backend/entities/SchoolclassModeEntity";

/**
 * @returns all default db instances as well as the entity specific repository
 * @since 0.0.1
 */
export function useSchoolclassModeRepository() {
    const {dao, db, sqliteDb} = useDao<SchoolclassModeEntity>(SchoolclassMode_Table);
    const schoolclassModeRepository = new SchoolclassModeRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        schoolclassModeRepository,
    };
}

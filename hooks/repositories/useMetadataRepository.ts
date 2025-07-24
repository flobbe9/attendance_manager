import { MetadataEntity } from "@/backend/entities/MetadataEntity";
import MetadataRepository from "@/backend/repositories/MetadataRepository";
import { Metadata_Table } from "@/backend/schemas/MetadataSchema";
import { useDao } from "@/backend/useDao";

/**
 * Should only return key specific methods, not the whole repo instance.
 * 
 * @returns all default db instances as well as some repo methods
 * @since latest
 */
export function useMetadataRepository() {
    const {dao, db, sqliteDb} = useDao<MetadataEntity>(Metadata_Table);
    const metadataRepository = new MetadataRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        metadataRepository
    };
}

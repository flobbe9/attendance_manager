import { SettingsEntity } from "@/backend/entities/SettingsEntity";
import { SettingsRepository } from "@/backend/repositories/SettingsRepository";
import { Settings_Table } from "@/backend/schemas/SettingsSchema";
import { useDao } from "@/backend/useDao";

/**
 * @returns all default db instances as well as the entity specific repository
 * @since 0.1.0
 */
export function useSettingsRepository() {
    const {dao, db, sqliteDb} = useDao<SettingsEntity>(Settings_Table);
    const settingsRepository = new SettingsRepository(db, sqliteDb);

    return {
        dao,
        db,
        sqliteDb,
        settingsRepository,
    };
}

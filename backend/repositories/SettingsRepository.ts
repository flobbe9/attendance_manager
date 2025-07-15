import { assertFalsyAndThrow } from "@/utils/utils";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { Settings_Table, SettingsEntity } from "../DbSchema";


/**
 * @since latest
 */
export class SettingsRepository extends AbstractRepository<SettingsEntity> {

    constructor(db: Db, sqliteDb: SQLiteDatabase) {
        super(db, sqliteDb, Settings_Table);
    }
    
    getBackReferenceColumnName(): string {
        return "settingsId";
    }

    getOwnedEntities(entity?: SettingsEntity): RelatedEntityDetail<SettingsEntity, any>[] {
        return [];
    }

    /**
     * Update or insert db entry with `key`
     * 
     * @param key match case-sensitively
     * @param value
     */
    public async updateValue(key: string, value: string | null): Promise<void> {
        this.updateOrInsert(
            {
                key: key,
                value: value
            }, 
            eq(Settings_Table.key, key)
        );
    }

    /**
     * Load the value of a setting expected to be "true" or "false". Does handle unexpected value gracefully.
     * 
     * @param settingsKey `key` column value for the boolean setting
     * @param defaultValue to return should `settingsKey` not exist. Default is `false`
     * @returns `value === "true"` or `defaultValue`
     * @throws if `settingsKey` is falsy
     */
    public async loadBooleanSetting(settingsKey: string, defaultValue = false): Promise<boolean> {
        assertFalsyAndThrow(settingsKey);

        const result = await this.select(eq(Settings_Table.key, settingsKey));
        if (result.length)
            return result[0].value === "true";

        return defaultValue; 
    }
}
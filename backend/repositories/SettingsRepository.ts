import { SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY, SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY } from "@/utils/constants";
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
     * @returns the value for {@link SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY} or `false` if result is `null`
     */
    public async getDontShowAttendanceValidationErrorPopup(): Promise<boolean> {

        const result = await this.select(eq(Settings_Table.key, SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY));

        if (result.length)
            return result[0].value === "true";

        return false; 
    }

    

    /**
     * @returns the value for {@link SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY} or `false` if result is `null`
     */
    public async getDontConfirmSchoolSubjectChange(): Promise<boolean> {

        const result = await this.select(eq(Settings_Table.key, SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY));

        if (result.length)
            return result[0].value === "true";

        return false; 
    }
}
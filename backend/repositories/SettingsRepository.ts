import { SQLiteDatabase } from "expo-sqlite";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { Db } from "../abstract/Db";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { Settings_Table, SettingsEntity } from "../DbSchema";
import { SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY } from "@/utils/constants";
import { eq } from "drizzle-orm";


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


    public async updateDontShowAttendanceValidationErrorPopup(dontShow: boolean): Promise<void> {

        this.persistCascade({
            key: SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY, 
            value: dontShow ? "true" : "false"
        });
    }


    /**
     * @returns the value for {@link SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY} or `true` if result is `null`
     */
    public async getDontShowAttendanceValidationErrorPopup(): Promise<boolean> {

        const result = await this.select(eq(Settings_Table.key, SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY));

        if (result.length)
            return result[0].value === "true";

        return false; // show popup if nothing else specified
    }
}
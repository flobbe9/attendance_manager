import { PrettyError } from "@/abstract/PrettyError";
import AbstractEntity from "@/backend/abstract/AbstractEntity";
import { AbstractRepository } from "@/backend/abstract/AbstractRepository";
import { DbBackupDto, DbBackupMode, isDbBackupDto, parseDbBackupDto } from "@/backend/abstract/DbBackupDto";
import { DbTransaction } from "@/backend/DbTransaction";
import migrations from "@/drizzle/migrations";
import { APP_VERSION, appJson, DB_BACKUP_FILE_EXTENSION, DB_BACKUP_FILE_MIME_TYPE } from "@/utils/constants";
import { pickFile, stringToFile } from "@/utils/projectUtils";
import { assertFalsyAndThrow, isBlank } from "@/utils/utils";
import { Platform } from "react-native";
import { useAttendanceRepository } from "./repositories/useAttendanceRepository";
import { useExaminantRepository } from "./repositories/useExaminantRepository";
import { useMetadataRepository } from "./repositories/useMetadataRepository";
import { useSchoolclassModeRepository } from "./repositories/useSchoolclassModeRepository";

/**
 * Should not do anything on mount as it might be included in many different components.
 *
 * Keep in mind that backup methods need to be compatible accross same drizzle migration versions.
 *
 * @since 0.2.2
 * @see https://react-native-cloud-storage.oss.kuatsu.de/docs/api/CloudStorage
 */
export function useDbBackup() {
    const { attendanceRepository, sqliteDb } = useAttendanceRepository();
    const { schoolclassModeRepository } = useSchoolclassModeRepository();
    const { examinantRepository } = useExaminantRepository();
    const { metadataRepository } = useMetadataRepository();

    const prettyFailedToPersistError = `Das Backup konnte nicht aufgespielt werden. Bitte wende dich an den Support.`;
    const prettyFailedToWriteError = `Es konnte kein Backup erstellt werden. Bitte wende dich an den Support.`;
    const prettyCorrupFileError = `Die BackupDatei ist korrupt. Erstelle eine neue Backupdatei und versuche es dann erneut.`;

    async function writeBackupToDevice(): Promise<void> {
        try {
            const dto = await loadDto('manual');
            await stringToFile(
                JSON.stringify(dto), 
                createDtoFileName('manual', dto.metadata.created), 
                DB_BACKUP_FILE_MIME_TYPE
            );
        } catch (e) {
            throw PrettyError.parseError(e, prettyFailedToWriteError);
        }
    }

    /**
     * Let user pick a backup file, parse the content and then persist the dto. Update some metadata in db if no errors occur.
     * 
     * @throws 304 if file picker was canceled by user
     * 
     * 400 if the file content is formatted unexpectedly
     * 
     * 406 if migration versions difffer 
     */
    async function persistBackupFromDevice(): Promise<void> {
        try {
            const backup = await pickFile({
                readContent: true,
                type: DB_BACKUP_FILE_MIME_TYPE
            })
    
            // case: user canceled file picking
            if (backup === null)
                throw new PrettyError(`canceled picking backup file`, null, 304);

            validateBackupFile(backup.mimeType, backup.name);
    
            const dto: DbBackupDto = parseDbBackupDto(backup.content);

            await persistDto(dto);
                
            await updateMetadata(dto.metadata.mode);

        } catch (e) {
            throw PrettyError.parseError(e, prettyFailedToPersistError);
        }
    }

    /**
     * Validate `dto`, then delete ALL entities that are to be persisted and then persist the ones from `dto`.
     * Do all this inside a transaction, so errors will cause a rollback and no changes will apply.
     *
     * @param dto to persist
     * @throws `PrettyError` if args invalid, dto invalid or an error occurs during persistence
     */
    async function persistDto(dto: DbBackupDto): Promise<void> {
        try {
            assertFalsyAndThrow(dto);

            const errorPhrase = `Failed to write dto to db`;

            validateDto(dto);

            await sqliteDb.execAsync(`PRAGMA FOREIGN_KEYS = 0`);

            const transaction = new DbTransaction(sqliteDb);
            await transaction.run(async () => {
                /**
                 * Delete all, then persist all
                 */
                async function persist<T extends AbstractEntity>(repository: AbstractRepository<T>, entities: T[]): Promise<void> {
                    let deleted = false;
                    // savepoint
                    deleted = await repository.delete();
                    if (!deleted) {
                        throw new PrettyError(
                            `${errorPhrase}. Error while deleting ${repository.getTableName()} entities`,
                            prettyFailedToPersistError,
                            500
                        );
                    }

                    const result = await repository.persist(entities);
                    if (result === null) {
                        throw new PrettyError(
                            `${errorPhrase}. Error while saving ${repository.getTableName()} entities`,
                            prettyFailedToPersistError,
                            500
                        );
                    }
                }

                await persist(attendanceRepository, dto.entities.allAttendanceEntities);
                await persist(schoolclassModeRepository, dto.entities.allSchoolclassModeEntities);
                await persist(examinantRepository, dto.entities.allExaminantEntities);
            });

        // make sure a pretty error is thrown
        } catch (e) {
            throw PrettyError.parseError(e, prettyFailedToPersistError);

        } finally {
            await sqliteDb.execAsync(`PRAGMA FOREIGN_KEYS = 1`);
        }
    }

    /**
     * Indicates whether `dto` may be written to db. Will throw if invalid adding pretty message and status code.
     *
     * @param dto to check
     * @throws `PrettyError` if invalid dto: 406 if migration keys are different, 400 if not an instance of `DbBackupDto`
     */
    function validateDto(dto: DbBackupDto): void {
        const defaultErrorMessage = `Failed to write dto to db. 'dto' is invalid. Keys: ${Object.keys(dto)}`;

        if (dto.metadata.migrationKey !== getLatestMigrationKey())
            throw new PrettyError(
                defaultErrorMessage,
                `Die backup Datei wurde von einer App mit inkompatibler App Version erstellt. Aktualisiere die App(s) und versuche es dann erneut.
                Backup App Version: ${dto.metadata.appVersion}
                Deine App Version: ${APP_VERSION}`,
                406
        )

        if (!isDbBackupDto(dto))
            throw new PrettyError(
                defaultErrorMessage,
                prettyCorrupFileError,
                400
            )
    }

    /**
     * Check file extension and mime type.
     * 
     * @param mimeType 
     * @param fileName must include the extension, can be the whole path or just the file name
     * @throws `PrettyError` 400 if invalid
     */
    function validateBackupFile(mimeType: string, fileName: string): void {
        if (isBlank(mimeType) || mimeType !== DB_BACKUP_FILE_MIME_TYPE)
            throw new PrettyError(
                `Invalid backup file mime type '${mimeType}'. Must be '${DB_BACKUP_FILE_MIME_TYPE}'`, 
                prettyCorrupFileError,
                400
            );

        if (isBlank(fileName) || !fileName.endsWith(DB_BACKUP_FILE_EXTENSION))
            throw new PrettyError(
                `Invalid backup file name '${fileName}'. Must end with '${DB_BACKUP_FILE_EXTENSION}'`, 
                `Es können nur Dateien mit der Endung '${DB_BACKUP_FILE_EXTENSION}' hochgeladen werden.`,
                400
            );
    }

    /**
     * Select all entities specified in backup dto interface from db. Also populate metadata property value.
     *
     * @returns all rows from all entities to be backed up
     * @throws if fails to load some entities or could not get latest migration key
     * @see DbBackupDto
     */
    async function loadDto(mode: DbBackupMode): Promise<DbBackupDto> {
        const errorPhrase = `Failed to load dto from db`;

        const allAttendanceEntities = await attendanceRepository.select();
        if (!allAttendanceEntities) {
            throw new Error(`${errorPhrase}. Failed to load attendanceEntities`);
        }

        const allSchoolclassModeEntities = await schoolclassModeRepository.select();
        if (!allSchoolclassModeEntities) {
            throw new Error(`${errorPhrase}. Failed to load schoolclassModeEntities`);
        }

        const allExaminantEntities = await examinantRepository.select();
        if (!allExaminantEntities) {
            throw new Error(`${errorPhrase}. Failed to load examinantEntities`);
        }

        const migrationKey = getLatestMigrationKey();
        if (isBlank(migrationKey)) {
            throw new Error(`${errorPhrase}. Failed to get latest migration key`);
        }

        return {
            entities: {
                allAttendanceEntities,
                allSchoolclassModeEntities,
                allExaminantEntities,
            },
            metadata: {
                migrationKey,
                created: new Date(),
                appVersion: APP_VERSION,
                mode,
                os: Platform.OS
            }
        };
    }

    /**
     * @returns the last drizzle migration key, see "/drizzle/migrations.js"
     */
    function getLatestMigrationKey(): string {
        const migrationKeys = Object.keys(migrations.migrations);

        return migrationKeys[migrationKeys.length - 1];
    }

    /**
     * @param mode 
     * @param created the time the backup is created. Should be the same as `dto.metadata.created`. Will use `new Date()` if not specified
     * @returns the backup filename
     */
    function createDtoFileName(mode: DbBackupMode, created?: Date): string {
        if (!created)
            created = new Date();

        if (mode === "manual")
            return `${appJson.slug}_backup_${created.getTime()}${DB_BACKUP_FILE_EXTENSION}`;

        return 'auto not implemented yet';
    }

    /**
     * Update `MetadataEntity` entries in db related to backup stuff.
     * 
     * @param mode to determine the right metadata keys 
     */
    async function updateMetadata(mode: DbBackupMode): Promise<void> {
        if (mode === 'manual')
            await metadataRepository.persistByKey('backup.manual.lastLoaded', new Date().getTime().toString());
        // TODO: auto
    }

    async function loadManualBackupLastLoaded(): Promise<Date> {
        const timeString = await metadataRepository.selectByKey('backup.manual.lastLoaded');
        return isBlank(timeString) ? null : new Date(Number(timeString));
    }

    // load = fetch data from db
    // persist = modify db data
    // get / created = simple action
    // device / cloud = location to store backup file (not the db)
    // backup = the json file containing the dto


    // download file
        // load backup
        // download as json with filename

    // createfilenameCloud
        // `v${APP_VERSION}-${new Date().getTime()}.json`;
        // manual
            // `attendance_manager_backup_${timestamp}.json`


    // getLatestFilenameFromCloud
    // find dir
    // list files
    // split -
    // get [1]
    // sort desc
    // return first

    // isUsingLatestBackup
    // trigger sync
    // match current filename with latest cloud file name

    /** Make cloud synchronize backup. Does not read or write */
    // syncCloudBackups
    // trigger sync
    // google??

    // writeBackupToCloud

    // persistBackupFromCloud
    // if is using latest backup
    // return
    // sync
    // read from cloud
    // parse
    // write to db
    // resolve promise

    // handleDisableSync
    // db entries
    // sync turned off
    // provider remove or null
    // last backup name null
    // remove user data
    // login stuff
    // cached tokens?
    // states?

    // handleEnableSync
    // case: cloud has backup files
    // prompt
    // load current data to cloud?
    // download current data from cloud?
    // case: cloud does not have backup files
    // writeBackupToCloud

    /** 
     * "NSPrivacyAccessedAPITypes": [
            {
                "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
                "NSPrivacyAccessedAPITypeReasons": [
                    "CA92.1"
                ]
            }
        ]
    */

    return {
        writeBackupToDevice,
        persistBackupFromDevice,
        loadManualBackupLastLoaded
    };
}

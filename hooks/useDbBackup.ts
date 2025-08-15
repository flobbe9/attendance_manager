import AbstractEntity from "@/backend/abstract/AbstractEntity";
import { AbstractRepository } from "@/backend/abstract/AbstractRepository";
import { DbBackupDto, isDbBackupDto } from "@/backend/abstract/DbBackupDto";
import { DbTransaction } from "@/backend/DbTransaction";
import migrations from "@/drizzle/migrations";
import { assertFalsyAndThrow, isBlank } from "@/utils/utils";
import { useAttendanceRepository } from "./repositories/useAttendanceRepository";
import { useExaminantRepository } from "./repositories/useExaminantRepository";
import { useSchoolclassModeRepository } from "./repositories/useSchoolclassModeRepository";

/**
 * Should not do anything on mount as it might be included in many different components.
 *
 * Keep in mind that backup methods need to be compatible accross drizzle migration versions.
 *
 * @since 0.2.2
 * @see https://react-native-cloud-storage.oss.kuatsu.de/docs/api/CloudStorage
 */
export function useDbBackup() {
    const { attendanceRepository, sqliteDb } = useAttendanceRepository();
    const { schoolclassModeRepository } = useSchoolclassModeRepository();
    const { examinantRepository } = useExaminantRepository();

    /**
     * Validate `dto`, then delete ALL entities that are to be persisted and then persist the ones from `dto`.
     * Do all this inside a transaction, so errors will cause a rollback and no changes will apply.
     *
     * @param dto to persist
     * @throws if args invalid, dto invalid or an error occurs during persistence
     */
    async function persistDto(dto: DbBackupDto): Promise<void> {
        assertFalsyAndThrow(dto);

        const errorPhrase = `Failed to write dto to db`;

        if (!isDtoValid(dto)) throw new Error(`${errorPhrase}. 'dto' is invalid. Keys: ${Object.keys(dto)}`);

        try {
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
                        throw new Error(`${errorPhrase}. Error while deleting ${repository.getTableName()} entities`);
                    }

                    const result = await repository.persist(entities);
                    if (result === null) {
                        throw new Error(`${errorPhrase}. Error while saving ${repository.getTableName()} entities`);
                    }
                }

                await persist(attendanceRepository, dto.entities.allAttendanceEntities);
                await persist(schoolclassModeRepository, dto.entities.allSchoolclassModeEntities);
                await persist(examinantRepository, dto.entities.allExaminantEntities);
            });

        } finally {
            await sqliteDb.execAsync(`PRAGMA FOREIGN_KEYS = 1`);
        }
    }

    /**
     * Indicates whether `dto` may be written to db.
     *
     * @param dto to check
     * @returns `true` if arg is an instance of `DbBackupDto` and it's `latestMigration` matches the current one
     */
    function isDtoValid(dto: DbBackupDto): boolean {
        return isDbBackupDto(dto) && dto.latestMigration === getLatestMigrationKey();
    }

    /**
     * Propably pretty expensive.
     *
     * @returns all rows from all entities to be backed up
     * @throws if fails to load some entities
     * @see DbBackupDto
     */
    async function loadDtoFromDb(): Promise<DbBackupDto> {
        const errorPhrase = `Failed to load dto from db`;

        const allAttendanceEntities = await attendanceRepository.select();
        if (!allAttendanceEntities) throw new Error(`${errorPhrase}. Failed to load attendanceEntities`);

        const allSchoolclassModeEntities = await schoolclassModeRepository.select();
        if (!allSchoolclassModeEntities) throw new Error(`${errorPhrase}. Failed to load schoolclassModeEntities`);

        const allExaminantEntities = await examinantRepository.select();
        if (!allExaminantEntities) throw new Error(`${errorPhrase}. Failed to load examinantEntities`);

        const latestMigration = getLatestMigrationKey();

        if (isBlank(latestMigration)) throw new Error(`${errorPhrase}. Failed to get latest migration key`);

        return {
            latestMigration,
            entities: {
                allAttendanceEntities,
                allSchoolclassModeEntities,
                allExaminantEntities,
            },
        };
    }

    /**
     * @returns the last drizzle migration key, see "/drizzle/migrations.js"
     */
    function getLatestMigrationKey(): string {
        const migrationKeys = Object.keys(migrations.migrations);

        return migrationKeys[migrationKeys.length - 1];
    }

    // upload file
    // upload
    // validate
    // parse to wrapper
    // writebackuptodb

    // download file
    // load backup
    // download as json with filename
    // where to?

    // createfilenameCloud
    // `v${APP_VERSION}-${new Date().getTime()}.json`;

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

    // backupFromDeviceToCloud

    // backupFromCloudToDevice
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
    // backupfromdevicetocloud

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
        getLatestMigrationKey,
        persistDto,
        loadDtoFromDb,
    };
}

/**
 * Should not do anything on mount as it might be included in many different components.
 * 
 * @since 0.2.2
 * @see https://react-native-cloud-storage.oss.kuatsu.de/docs/api/CloudStorage
 */
export function useDbBackup() {

    // stringifyDto(wrapper): json string

    // parseDto(jsonString): wrapper

    // writeDtoToDb(wrapper)

    // loadDtoFromDb(): wrapper

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
}

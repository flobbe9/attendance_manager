// dont change the order
const metadataKeysObj = {
    "backup.auto.enabled": 0,
    /** File name of the backup file last successfully loaded to device */
    "backup.auto.lastFileName": 1,
    /** TODO: make an enum for that, document possible values */
    "backup.auto.cloudProvider": 2,
    /** Whether not to show a popup on invalid attendance input. Default should be false */
    "popups.dontShowAttendanceInputValidationErrorPopup": 3,
    /** Whether not to show a popup on school subject change. Default should be false */
    "popups.dontConfirmSchoolSubjectChnage": 4,
    "popups.dontConfirmAttendanceScreenLeave": 5,
    /** `getTime` value of last SUCCESSFUL manual backup loaded to device */
    "backup.manual.lastLoaded": 6,
};

export const METADATA_KEYS = Object.keys(metadataKeysObj);

/**
 * Use these to store metadata, use them as `MetadataEntity.key`.
 *
 * @since 0.2.2
 */
export type MetadataKey = keyof typeof metadataKeysObj;

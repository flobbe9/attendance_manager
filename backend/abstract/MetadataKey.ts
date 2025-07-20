// dont change the order
const metadataKeysObj = {
    "cloud.backup.enabled": 0,
    /** File name of the backup file last successfully loaded to device */
    "cloud.backup.lastFileName": 1,
    "cloud.provider": 2,
};

export const METADATA_KEYS = Object.keys(metadataKeysObj);

/**
 * Use these to store metadata, use them as `MetadataEntity.key`.
 *
 * @since latest
 */
export type MetadataKey = keyof typeof metadataKeysObj;

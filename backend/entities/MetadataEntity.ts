import AbstractEntity from "../abstract/AbstractEntity";
import { MetadataKey } from "../abstract/MetadataKey";

/**
 * Entity for storing uncategorized key value pairs.
 *
 * See SettingsEntity for settings specific data.
 *
 * @since 0.2.2
 * @see MetadataKey
 */
export class MetadataEntity extends AbstractEntity {
    key: MetadataKey;
    value: string;
}

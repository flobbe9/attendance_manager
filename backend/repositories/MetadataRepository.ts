import { assertFalsyAndThrow, isBlank } from "@/utils/utils";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { MetadataKey } from "../abstract/MetadataKey";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { MetadataEntity } from "../entities/MetadataEntity";
import { eq } from "drizzle-orm";
import { Metadata_Table } from "../schemas/MetadataSchema";
import { logDebug, logError } from "@/utils/logUtils";

/**
 * @since latest
 */
export class MetadataRepository extends AbstractRepository<MetadataEntity> {

    getBackReferenceColumnName(): string {
        return "metadataId";
    }

    getOwnedEntities(_entity?: MetadataEntity): RelatedEntityDetail<MetadataEntity, any>[] {
        return [];
    }

    // TODO. settings updateValue

    /**
     * 
     * @param key 
     * @returns `true` if a db entry exists with `key` (regardless of it's value)
     * @throws if `key` is falsy
     */
    private async existsByKey(key: MetadataKey): Promise<boolean> {
        assertFalsyAndThrow(key);

        return await this.exists(eq(Metadata_Table.key, key));
    }

    /**
     * Create or update db entry for given key.
     * @param key 
     * @param value 
     * @returns error message or `null` if no error
     */
    public async save(key: MetadataKey, value: string): Promise<string | null> {
        assertFalsyAndThrow(key);

        if (isBlank(key))
            throw new Error(`Falsy arg at index 0. 'key' cannot be blank`);

        const cleanValue = MetadataRepository.fixEmptyColumnValue(value);

        const existsByKey = await this.existsByKey(key);

        const where = existsByKey ? eq(Metadata_Table.key, key) : undefined;

        const result = await this.persist(
            {
                key: key,
                value: cleanValue
            },
            where
        )

        let errorMessage: string = null;

        if (!result) {
            errorMessage = `Failed to save metadata for key ${key}`;
            logError(errorMessage);
        }

        return errorMessage;
    }

    // save(key, value)
        // assert args falsy AND blank
        // if exists by key
            // update
        // else
            // insert

    // delete(key)
        // handle gracefully

    // load(key): string | null
        // 
}
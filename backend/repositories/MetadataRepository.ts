import { assertFalsyAndThrow, isBlank } from "@/utils/utils";
import { AbstractRepository } from "../abstract/AbstractRepository";
import { MetadataKey } from "../abstract/MetadataKey";
import { RelatedEntityDetail } from "../abstract/RelatedEntityDetail";
import { MetadataEntity } from "../entities/MetadataEntity";
import { eq } from "drizzle-orm";
import { Metadata_Table } from "../schemas/MetadataSchema";
import { logDebug, logError } from "@/utils/logUtils";
import { Db } from "../abstract/Db";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Update this in order to ensure that both classes have all expected methods.
 * 
 * @since latest
 */
interface MetadataRepositoryDef {
    getBackReferenceColumnName: () => string;

    getOwnedEntities: (entity?: MetadataEntity) => RelatedEntityDetail<MetadataEntity, any>[];
    
    existsByKey: (key: MetadataKey) => Promise<boolean>;
    
    persistByKey: (key: MetadataKey, value: string) => Promise<string | null>;
    
    deleteByKey: (key: MetadataKey) => Promise<void>;
    
    selectByKey: (key: MetadataKey) => Promise<string | null>;

    selectByKeyParseBoolean: (key: MetadataKey, defaultValue: boolean) => Promise<boolean>;
}

/**
 * For keeping dao and abstract repo methods from this instance.
 * Basically creates an insatnce of `MetadataRepository` and does nothing but call it's methods. 
 * 
 * @since latest
 */
export default class MetadataRepositoryImpl implements MetadataRepositoryDef {
    private metadataRepository: MetadataRepository;

    constructor(db: Db, sqliteDb: SQLiteDatabase) {
        this.metadataRepository = new MetadataRepository(db, sqliteDb);
    }

    getBackReferenceColumnName(): string {
        return this.metadataRepository.getBackReferenceColumnName();
    }

    getOwnedEntities(_entity?: MetadataEntity): RelatedEntityDetail<MetadataEntity, any>[] {
        return this.metadataRepository.getOwnedEntities();
    }

    public async existsByKey(key: MetadataKey): Promise<boolean> {
        return await this.metadataRepository.existsByKey(key);
    }

    public async persistByKey(key: MetadataKey, value: string): Promise<string | null> {
        return await this.metadataRepository.persistByKey(key, value);
    }

    public async deleteByKey(key: MetadataKey): Promise<void> {
        await this.metadataRepository.deleteByKey(key);
    }

    public async selectByKey(key: MetadataKey): Promise<string | null> {
        return await this.metadataRepository.selectByKey(key);
    }

    public async selectByKeyParseBoolean(key: MetadataKey, defaultValue = false): Promise<boolean> {
        return await this.metadataRepository.selectByKeyParseBoolean(key, defaultValue);
    }
}

/**
 * NOTE: methods wont check if `key` args are actually of type {@link MetadataKey}.
 * 
 * @since latest
 */
class MetadataRepository extends AbstractRepository<MetadataEntity> implements MetadataRepositoryDef {
    constructor(db: Db, sqliteDb: SQLiteDatabase) {
        super(db, sqliteDb, Metadata_Table);
    }

    getBackReferenceColumnName(): string {
        return "metadataId";
    }

    getOwnedEntities(_entity?: MetadataEntity): RelatedEntityDetail<MetadataEntity, any>[] {
        return [];
    }

    /**
     * @param key 
     * @returns `true` if a db entry exists with `key` (regardless of it's value)
     * @throws if `key` is falsy
     */
    public async existsByKey(key: MetadataKey): Promise<boolean> {
        assertFalsyAndThrow(key);

        return await this.exists(eq(Metadata_Table.key, key));
    }

    /**
     * Create or update db entry for given key.
     * 
     * @param key 
     * @param value 
     * @returns error message or `null` if no error
     * @throws if `key` is falsy
     */
    public async persistByKey(key: MetadataKey, value: string): Promise<string | null> {
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

    /**
     * @param key 
     * @returns 
     * @throws if `key` is falsy
     */
    public async deleteByKey(key: MetadataKey): Promise<void> {
        assertFalsyAndThrow(key);

        await this.delete(eq(Metadata_Table.key, key));
    }

    /**
     * @param key 
     * @returns 
     * @throws if `key` is falsy
     */
    public async selectByKey(key: MetadataKey): Promise<string | null> {
        assertFalsyAndThrow(key);

        const result = await this.select(eq(Metadata_Table.key, key));

        return result?.length ? result[0].value : null;
    }

    /**
     * @param key 
     * @param defaultValue returned if retrieved value is not a boolean value or `key` has no db entry. Default is `false`
     * @returns `true` if value is `"true" || "1"`, `false` if value is `"false" || "0"`, else `defaultValue` 
     * @throws if `key` is falsy
     */
    public async selectByKeyParseBoolean(key: MetadataKey, defaultValue = false): Promise<boolean> {
        assertFalsyAndThrow(key);

        const result = await this.selectByKey(key);

        if (result === "true" || result === "1")
            return true;

        if (result === "false" || result === "0")
            return false;

        return defaultValue;
    }
}
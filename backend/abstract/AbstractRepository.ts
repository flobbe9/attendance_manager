import { log, logDebug, logError, logTrace } from "@/utils/logUtils";
import { assertFalsyAndThrow, getRandomString, isAnyFalsy, isBooleanFalsy } from "@/utils/utils";
import { and, eq, getTableName, notInArray, SQL } from "drizzle-orm";
import { alias, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteDatabase } from "expo-sqlite";
import { DbTransaction } from "../DbTransaction";
import AbstractEntity from "./Abstract_Schema";
import { Cascade } from "./Cascade";
import { Dao } from "./Dao";
import { Db } from "./Db";
import { FetchType } from "./FetchType";
import { getFetchType, RelatedEntityDetail } from "./RelatedEntityDetail";
import { EntityRelationType } from "./EntityRelationType";


/**
 * @since 0.0.1
 */
export abstract class AbstractRepository<E extends AbstractEntity> extends Dao<E> {

    /** For raw sql queries */
    protected sqliteDb: SQLiteDatabase;


    /**
     * @param db get this by calling `useDao`
     * @param table 
     */
    constructor(db: Db, sqliteDb: SQLiteDatabase, table: SQLiteTableWithColumns<any>) {

        super(db, table);
        this.sqliteDb = sqliteDb;
    }


    /**
     * The column name of the backreference in other entities, e.g. "entityId". Make sure that all schemas referencing this entity
     * use this name.
     * 
     * @return the column name of this entitie's backreference
     */
    abstract getBackReferenceColumnName(): string;
    

    /**
     * Get all property values that are an {@link AbstractEntity} (possibly a collection) as well as their tables.
     * 
     * @param entity for getting the column values of related entites. Leave values at `undefined` if not specified
     * @return details of all owned entities of `entity`
     */
    abstract getOwnedEntities(entity?: E): RelatedEntityDetail<E, any>[];


    /**
     * Select all `E` with given `where` and attach all owned entities that are marked as `FetchType.EAGER`.
     * 
     * @param where used only for initial `select()` statement. Optional
     * @returns `E` with all owned entites attached or `null` if error
     */
    public async selectCascade(where?: SQL): Promise<E[] | null> {

        try {
            const entityResults = await this.select(where);
            if (!entityResults)
                throw new Error(`Failed to cascade select entity '${this.getTableName()}'`);

            for (const ownedEntityDetail of this.getOwnedEntities()) {
                if (getFetchType(ownedEntityDetail.fetchType) === FetchType.LAZY)
                    continue;

                for (const entityResult of entityResults) {
                    const ownedEntityRepository = ownedEntityDetail.repository;

                    // fetch owned entity's owned entities
                    const ownedEntityResults = await ownedEntityRepository.selectCascade(eq(ownedEntityRepository.table[this.getBackReferenceColumnName()], entityResult.id));
                    if (!ownedEntityResults)
                        throw new Error(`Failed to cascade select owned entity '${ownedEntityRepository.getTableName()}`);
                    
                    entityResult[ownedEntityDetail.column.name] = ownedEntityDetail.relationType === EntityRelationType.ONE_TO_ONE ? ownedEntityResults[0] : ownedEntityResults;
                }
            }

            return entityResults;

        } catch (e) {
            logError(e.message);
            return null;
        }
                
    }
    

    /**
     * Persist `values` including related entities, as if cascade was set. Consider {@link Cascade} 
     * configuration of related entites though.
     * 
     * Should not throw but log errors and return `null`.
     * 
     * @param values to insert
     * @param currentTransaction the ongoing transaction. Will be used instead of creating a new one to prevent nested transactions
     * @return persisted values exactly as now present in db table. Include saved related entites. `null` if error
     */
    public async persistCascade(values: E, currentTransaction?: DbTransaction): Promise<E | null> {
        
        if (!values)
            return null;

        const transaction = currentTransaction ?? new DbTransaction(this.sqliteDb);

        const transactionCallback = async () => {

            // save owning entity
            let owningEntityResult = await super.updateOrInsert(values);
            // case: was update, returned an array with 1 element
            if (Array.isArray(owningEntityResult))
                owningEntityResult = owningEntityResult[0];

            assertFalsyAndThrow(owningEntityResult); 

            const ownedEntities = this.getOwnedEntities(values);

            // NOTE: dont use js forEach as that will prevent nested recursion errors from bubbling up
            for (const relatedEntityDetail of ownedEntities) {
                const relatedEntityValue = relatedEntityDetail.column.value;

                let result: typeof relatedEntityValue;

                // case: one to many (many related entities)
                if (Array.isArray(relatedEntityValue)) {
                    result = [];

                    await this.handleOrphanRemoval(owningEntityResult.id, relatedEntityDetail);
                    
                    for (const relatedEntityValueEl of relatedEntityValue) {
                        if (!await relatedEntityDetail.repository.isCascadeWhenPersist(relatedEntityValueEl, relatedEntityDetail.cascade)) {
                            logTrace("Wont cascade for", relatedEntityDetail.column.name)
                            continue;
                        }

                        const itemResult = await this.persistCascadeRelatedEntity(relatedEntityValueEl, relatedEntityDetail.repository, owningEntityResult.id, transaction);
                        assertFalsyAndThrow(itemResult);
                        
                        result.push(itemResult);
                    }
                        
                // case: one to one (one related entity)
                } else {
                    if (!await relatedEntityDetail.repository.isCascadeWhenPersist(relatedEntityValue, relatedEntityDetail.cascade)) {
                        logTrace("Wont cascade for", relatedEntityDetail.column.name)
                        continue;
                    }

                    result = await this.persistCascadeRelatedEntity(relatedEntityValue, relatedEntityDetail.repository, owningEntityResult.id, transaction);
                    assertFalsyAndThrow(result);
                }
                    
                // add related entity result to owning entity
                owningEntityResult[relatedEntityDetail.column.name] = result; 
            }

            return owningEntityResult;
        };

        return currentTransaction ? await transactionCallback() : await transaction.run(transactionCallback);
    }
        

    /**
     * Persist `relatedEntity` into it's table setting `backReferenceValue` as reference to the owning entity.
     * 
     * @param relatedEntity to psersist 
     * @param relatedEntityRepository to psersist `relatedEntity`
     * @param backReferenceValue primary key which references the owning entity (the parent entities' id in most cases)
     * @param currentTransaction the ongoing transaction. Can be passed to db functions in recursive calls to prevent nested transactions
     * @returns the db result, or `null` if error
     */
    private async persistCascadeRelatedEntity<RE extends AbstractEntity>( 
        relatedEntity: RE, 
        relatedEntityRepository: AbstractRepository<RE>, 
        backReferenceValue: any,
        currentTransaction?: DbTransaction
    ): Promise<RE | null> {

        assertFalsyAndThrow(relatedEntity, relatedEntityRepository);
        
        if (!isAnyFalsy(backReferenceValue))
            relatedEntity[this.getBackReferenceColumnName()] = backReferenceValue;
        
        else 
            logDebug(`WARN: Inserting related entity of type ${relatedEntity.constructor.name} without setting the backreference ${backReferenceValue}.`);
        
        return await relatedEntityRepository.persistCascade(relatedEntity, currentTransaction);
    }


    /**
     * Delete related entities that should no longer be related to entity `E` with `id` (not in `newRelatedEntityDetail.column.value`), consider `orphanRemoval` is `true`.
     * 
     * @param id of owning entity (type `E` that is)
     * @param newRelatedEntityDetail contains new related entities that existing ones will be checked against
     */
    private async handleOrphanRemoval<RE extends AbstractEntity>(id: number, newRelatedEntityDetail: RelatedEntityDetail<E, RE>): Promise<void> {

        assertFalsyAndThrow(id);

        if (!newRelatedEntityDetail || 
            !Array.isArray(newRelatedEntityDetail.column.value) || // not one-to-may
            !newRelatedEntityDetail.orphanRemoval) // orphanremoval intentionally disabled 
            return;

        const newRelatedEntityIds = newRelatedEntityDetail.column.value.map(entity => entity.id);
        const relatedEntityRepository = newRelatedEntityDetail.repository;
        const relatedEntityTable = relatedEntityRepository.table;

        // delete related entities matching diffIds
        await relatedEntityRepository.delete(
            and(
                // is related entity
                eq(relatedEntityTable[this.getBackReferenceColumnName()], id),
                // is not in in "new" list
                notInArray(relatedEntityTable.id, newRelatedEntityIds)
            )
        );
    }


    /**
     * Indicates whether `relatedValues` should have cascade applied if parent is persisted (insert or update).
     * Predicts the type of persist operation and checks if the matching cascade type is present.
     * 
     * @param relatedValues to check for cascade
     * @param cascade cascade types that are supported for `relatedValues`
     * @returns `true` if the persist operation may be executed 
     */
    private async isCascadeWhenPersist<RE extends AbstractEntity>(relatedValues: RE, cascade: Set<Cascade> | undefined): Promise<boolean> {

        assertFalsyAndThrow(relatedValues);

        // case: no cascade specified at all
        if (!cascade || !cascade.size)
            return false;

        let valuesExist = !!relatedValues.id && await this.existsById(relatedValues.id);

        return (!!valuesExist && cascade.has(Cascade.UPDATE)) ||
                (!valuesExist && cascade.has(Cascade.INSERT));
    }
}
import { log, logDebug, logError, logTrace } from "@/utils/logUtils";
import { assertFalsyAndThrow, isFalsy } from "@/utils/utils";
import { and, eq, inArray, notInArray, SQL } from "drizzle-orm";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { SQLiteDatabase } from "expo-sqlite";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import { DbTransaction } from "../DbTransaction";
import AbstractEntity from "./AbstractEntity";
import { Cascade } from "./Cascade";
import { Dao } from "./Dao";
import { Db } from "./Db";
import { EntityRelationType } from "./EntityRelationType";
import { FetchType } from "./FetchType";
import { getFetchType, RelatedEntityDetail } from "./RelatedEntityDetail";

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
            if (!entityResults) throw new Error(`Failed to cascade select entity '${this.getTableName()}'`);

            for (const ownedEntityDetail of this.getOwnedEntities()) {
                if (getFetchType(ownedEntityDetail.fetchType) === FetchType.LAZY) continue;

                for (const entityResult of entityResults) {
                    const ownedEntityRepository = ownedEntityDetail.repository;

                    // fetch owned entity's owned entities
                    const ownedEntityResults = await ownedEntityRepository.selectCascade(
                        eq(ownedEntityRepository.table[this.getBackReferenceColumnName()], entityResult.id)
                    );
                    if (!ownedEntityResults) throw new Error(`Failed to cascade select owned entity '${ownedEntityRepository.getTableName()}`);

                    entityResult[ownedEntityDetail.column.name] =
                        ownedEntityDetail.relationType === EntityRelationType.ONE_TO_ONE ? ownedEntityResults[0] : ownedEntityResults;
                }
            }

            return entityResults;
        } catch (e) {
            logError(e.message);
            return null;
        }
    }

    /**
     * @param values to insert
     * @returns db result merged with `values` "object" type fields or `null` if error
     */
    public async insert<T extends E | E[]>(values: T): Promise<T> {
        const insertResult = await super.insert(values);
        if (!insertResult) return null;

        this.transferRelatedEntities(insertResult, values);

        return insertResult;
    }

    /**
     * Overload.
     *
     * @param values
     * @param where
     * @returns the select cascade result of all entities that where updated selecting them by their primary keys or `null` if error
     */
    public async update(values: E, where?: SQL): Promise<E | E[]> {
        const udpateResult = await super.update(values, where);
        if (!udpateResult) return null;

        const selectResult = await this.selectCascade(this.generatePrimaryKeyWhere(udpateResult));

        this.transferRelatedEntities(Array.isArray(udpateResult) ? selectResult : selectResult[0], values);

        return Array.isArray(udpateResult) ? selectResult : selectResult[0];
    }

    /**
     * @param values to select by their primary key
     * @returns an `and` where clause that will select all `values` by their primary keys
     */
    private generatePrimaryKeyWhere(values: E | E[]): SQL {
        assertFalsyAndThrow(values);

        const primaryKeyWheres: SQL[] = this.getPrimaryKeyColumnNames().map((primaryKeyColumnName) => {
            const primaryKeyValues = Array.isArray(values) ? values.map((value) => value[primaryKeyColumnName]) : [values[primaryKeyColumnName]];

            return inArray(this.table[primaryKeyColumnName], primaryKeyValues);
        });

        return and(...primaryKeyWheres);
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
    public async persistCascade<T extends E | E[]>(values: T, currentTransaction?: DbTransaction): Promise<T | null> {
        // NOTE: dont use js forEach as that will prevent nested recursion errors from bubbling up
        if (!values) return null;

        const transaction = currentTransaction ?? new DbTransaction(this.sqliteDb);

        const transactionCallback = async (): Promise<T> => {
            // save owning entity
            let owningEntityResults = await super.persist(values);

            // make an array for convenience
            if (!Array.isArray(owningEntityResults)) owningEntityResults = [owningEntityResults as E];

            // iterate over unsaved values because persist result removes related entities
            for (const owningEntityResult of owningEntityResults) {
                const ownedEntities = this.getOwnedEntities(owningEntityResult);
                // persist related entities with cascade enabled
                for (const relatedEntityDetail of ownedEntities) {
                    const relatedEntityValue = relatedEntityDetail.column.value;

                    let relatedEntitiesToCascade: typeof relatedEntityValue;

                    // case: one to many (many related entities)
                    if (Array.isArray(relatedEntityValue)) {
                        relatedEntitiesToCascade = [];

                        await this.handleOrphanRemoval(owningEntityResult.id, relatedEntityDetail);

                        for (const relatedEntityValueEl of relatedEntityValue) {
                            if (!(await relatedEntityDetail.repository.isCascadeWhenPersist(relatedEntityValueEl, relatedEntityDetail.cascade))) {
                                logTrace("Wont cascade for", relatedEntityDetail.column.name);
                                continue;
                            }

                            relatedEntitiesToCascade.push(relatedEntityValueEl);
                        }

                        // case: one to one (one related entity)
                    } else {
                        if (!(await relatedEntityDetail.repository.isCascadeWhenPersist(relatedEntityValue, relatedEntityDetail.cascade))) {
                            logTrace("Wont cascade for", relatedEntityDetail.column.name);
                            continue;
                        }

                        await this.handleOrphanRemoval(owningEntityResult.id, relatedEntityDetail);

                        relatedEntitiesToCascade = relatedEntityValue;
                    }

                    const relatedEntityResult = await this.persistCascadeRelatedEntity(
                        relatedEntitiesToCascade,
                        relatedEntityDetail.repository,
                        owningEntityResult.id,
                        transaction
                    );
                    assertFalsyAndThrow(relatedEntityResult);

                    // add related entity result to owning entity
                    owningEntityResult[relatedEntityDetail.column.name] = relatedEntityResult;
                }
            }

            return Array.isArray(values) ? (owningEntityResults as T) : (owningEntityResults[0] as T);
        };

        try {
            return currentTransaction ? await transactionCallback() : await transaction.run(transactionCallback);
        } catch (e) {
            return null;
        }
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
        relatedEntity: RE | RE[],
        relatedEntityRepository: AbstractRepository<RE>,
        backReferenceValue: any,
        currentTransaction?: DbTransaction
    ): Promise<RE | RE[] | null> {
        assertFalsyAndThrow(relatedEntity, relatedEntityRepository);
        
        if (!isFalsy(backReferenceValue))
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

        if (
            !newRelatedEntityDetail ||
            !newRelatedEntityDetail.orphanRemoval // orphanremoval intentionally disabled
        )
            return;

        let newRelatedEntityIds: number[] = [];
        // case: one-to-many
        if (Array.isArray(newRelatedEntityDetail.column.value)) newRelatedEntityDetail.column.value.map((entity: any) => entity.id ?? 0);
        // case: one-to-one
        else newRelatedEntityIds.push(newRelatedEntityDetail.column.value.id ?? 0);

        const relatedEntityRepository = newRelatedEntityDetail.repository;
        const relatedEntityTable = relatedEntityRepository.table;

        await relatedEntityRepository.delete(
            and(
                // was related entity until now
                eq(relatedEntityTable[this.getBackReferenceColumnName()], id),
                // is no longer related entity
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
        // case: no cascade specified at all
        if (!relatedValues || !cascade || !cascade.size) return false;

        let valuesExist = !!relatedValues.id && (await this.existsById(relatedValues.id));

        return (valuesExist && cascade.has(Cascade.UPDATE)) || (!valuesExist && cascade.has(Cascade.INSERT));
    }

    /**
     * Iterate all fields of `entity` including related entities' fields and change `undefined` values to `null`. This does not include
     * missing properties (which would also be considered `undefined`).
     *
     * This is for database update method to modify falsy column values. `undefined` values will be ignored by db, `null` values wont.
     *
     * @param entity to fix values for
     * @returns modified `entity` or just `entity` if is falsy)
     */
    public static fixEmptyColumnValues<E extends AbstractEntity>(entity: E): E {
        if (!entity) return entity;

        Object.entries(entity)
            .forEach(([key, value]) => {
                if (value === undefined)
                    entity[key] = AbstractRepository.fixEmptyColumnValue(value);

                else if (typeof value === "object" && !isFalsy(value))
                    if (Array.isArray(value))
                        value.forEach(nestedEntity => this.fixEmptyColumnValues(nestedEntity));
                    else
                        this.fixEmptyColumnValues(value);
            })

        return entity;
    }

    /**
     * @param value to fix (not modified)
     * @returns null or `value`
     * @see {@link fixEmptyColumnValues}
     */
    public static fixEmptyColumnValue<T>(value: T): T {
        if (value === undefined) return null;

        return value;
    }

    /**
     * @returns list of column names that are marked as primary key for this table
     */
    protected getPrimaryKeyColumnNames(): (keyof E)[] {
        return ["id"];
    }

    /**
     * Transfer all "object" type field values from `rawValues` to `dbResult` as these wont be returned by persist functions.
     *
     * @param dbResult modified entitie(s) returned by some persist function which needs the unsaved related entity fields passed
     * @param rawValues entitie(s) that were passed to that same persist function that may also contain related entities that were not persisted
     * If is an array, expected to have the same length as `dbResult`
     */
    private transferRelatedEntities<T extends E | E[]>(dbResult: T, rawValues: T): void {
        const transfer = (singleDbResult: E, key: keyof E, value: ValueOf<E>): void => {
            if (typeof value === "object") singleDbResult[key] = value;
        };

        if (Array.isArray(rawValues))
            rawValues.forEach((rawValue, i) => {
                Object.entries(rawValue).forEach(([key, value]) => transfer((dbResult as E[])[i], key as keyof E, value));
            });
        else Object.entries(rawValues).forEach(([key, value]) => transfer(dbResult as E, key as keyof E, value));
    }
}

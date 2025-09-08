import { logError, logTrace } from "@/utils/logUtils";
import { getRandomString, isBlank, isNumberFalsy } from "@/utils/utils";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Drizzle transaction does not rollback properly, this is the replacement.
 *
 * Usage:
 *
 * ```
 * new DbTransaction(sqliteDb).run(async () => {
 *      await drizzleDb.insert({bla: bla});
 *      // ...more
 * });
 * ```
 *
 * @since 0.0.1
 * @see docs: https://www.sqlite.org/lang_savepoint.html
 */
export class DbTransaction {
    /**
     * Unique random id to identify transactions and their savepoints.
     * Generated upon initialization.
     */
    private uid: string;

    /**
     * Used for savepoint naming. 1-based, should be initialized with 0.
     */
    private savepointCount: number;

    /**
     * Indicates that the transaction has been rolled back (to a savepoint or completely).
     */
    private rolledBack: boolean;

    /**
     * Indicates that the transaction has been canceled.
     */
    private canceled: boolean;

    /**
     * Can be retrieved by `useSqliteContext()`. Use `useDao()` though
     */
    private sqliteDb: SQLiteDatabase;

    constructor(sqliteDb: SQLiteDatabase) {
        if (!sqliteDb) throw new Error("Failed to instantiate DbTransaction. 'sqliteDb' cannot be falsy");

        this.uid = getRandomString();
        this.savepointCount = 0;
        this.rolledBack = false;
        this.canceled = false;
        this.sqliteDb = sqliteDb;
    }

    /**
     * Begin a new transaction and commit it unless canceled. Rollback entire transaction if callback throws and
     * throw an error sothat callback stops executing. No need for try catch inside callback
     *
     * @param transactionCallback call all your db actions in here. Returns whatever you specify or `null` if error
     * @returns the `transactionCallback` value or `null` if callback is falsy
     * @throws if error during `transactionCallback`
     */
    public async run<T>(transactionCallback: () => Promise<T | null>): Promise<T | null> {
        if (!transactionCallback) return null;

        try {
            this.sql(`BEGIN TRANSACTION`);

            return await transactionCallback();
        } catch (e) {
            logError(`${this.rolledBack ? "" : "Rollback: "}${e.message}`);
            this.rollback(null, e.message);
        } finally {
            if (!this.canceled) this.sql(`COMMIT`);
        }
    }

    /**
     * Rollback the current transaction unless {@link canceled} or {@link rolledBack} already, then throw.
     *
     * If `savepointCount` is not specified, rollback the entire transaction and set {@link canceled} to `true`.
     * Always set {@link rolledBack} to `true`.
     *
     * @param savepointCount nth savepoint to rollback to
     * @param message to add to error
     * @throws definitively, adding `message`
     */
    public rollback(savepointCount?: number, message = ""): never {
        let errorMessage = "";
        if (!this.rolledBack && !this.canceled) {
            if (!isNumberFalsy(savepointCount)) {
                const savepointName = this.getSavepointName(savepointCount);
                logTrace(`rollback to savepoint ${savepointName}`);
                this.sql(`ROLLBACK TO SAVEPOINT '${savepointName}'`);

                errorMessage = `Rollback to savepoint ${savepointCount}`;
            } else {
                logTrace(`rollback`);
                this.sql(`ROLLBACK`);
                this.canceled = true;

                errorMessage = `Rollback entire transaction`;
            }

            this.rolledBack = true;
        }

        throw new Error(`${errorMessage}${isBlank(message) ? "" : ` with error: ${message}`}`);
    }

    /**
     * Add new named savepoint and increase {@link savepointCount}.
     *
     * @return savepoint count of added savepoint (1-based)
     */
    public savepoint(): number {
        this.savepointCount++;

        this.sql(`SAVEPOINT '${this.getSavepointName()}'`);

        logTrace(`savepoint ${this.savepointCount}`);

        return this.savepointCount;
    }

    /**
     * @param savepointCount count of savepoint to get name for (1-based). Default is last added savepoint number
     * @returns the savepoint name or `undefined` if the savepoint count is `< 1`
     */
    private getSavepointName(savepointCount = this.savepointCount): string | undefined {
        if (savepointCount < 1) return undefined;

        return `${this.uid}_${savepointCount}`;
    }

    /**
     * "Commit" savepoint with given number. This will not commit or cancel the transaction. The `savepointCount`
     * will not be changed.
     *
     * @param savepointCount nth savepoint to release
     */
    public releaseSavepoint(savepointCount: number): void {
        const savepointName = this.getSavepointName(savepointCount);

        logTrace(`release savepoint ${savepointName}`);
        this.sql(`RELEASE SAVEPOINT '${savepointName}'`);
    }

    /**
     * Run given `source` synchronously
     *
     * @param source raw sql to execute. Wont be santized or checked!
     */
    private sql(source: string): void {
        this.sqliteDb.execSync(source);
    }
}

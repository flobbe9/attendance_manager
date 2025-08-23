import migrations from "@/drizzle/migrations";
import { useFileLogger } from "@/hooks/useFileLogger";
import { DATABASE_NAME, DRIZZLE_DB_CONFIG, ENV } from "@/utils/constants";
import { logDebug } from "@/utils/logUtils";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { ReactNode, Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";

interface Props {
    children: ReactNode;
    /** Default is ```true``` */
    useSuspense?: boolean;
}

/**
 * Development db ui: http://localhost:8081/_expo/plugins/expo-drizzle-studio-plugin
 *
 * NOTE: dont touch the drizzle migration files xd
 *
 * @since 0.0.1
 * @see https://orm.drizzle.team/docs/overview
 */
export default function CustomSqliteProvider({ children, useSuspense = true }: Props) {
    const sqliteSync = openDatabaseSync(DATABASE_NAME);
    const db = drizzle(sqliteSync, DRIZZLE_DB_CONFIG);
    const { error: migrationsError, success } = useMigrations(db, migrations);

    const { initializeFileLogger } = useFileLogger();

    // drizzle dev tools
    if (process.env.NODE_ENV !== "production") useDrizzleStudio(sqliteSync);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (migrationsError) logDebug("Db migration error: " + migrationsError.message);
        if (success) logDebug("No db migration errors");
    }, [migrationsError, success]);

    async function init(): Promise<void> {
        await initializeFileLogger();

        if (ENV !== "development") {
            logDebug("Db migrations: ", { ...migrations, migrations: "see below" }); // log migrations separatly because .sql file is not formatted properly in log file
            logDebug(formatMigrationFiles());
        }
    }

    function formatMigrationFiles(): string {
        return JSON.stringify(migrations.migrations).replaceAll("\\n", "\n").replaceAll("\\r", "\r").replaceAll("\\t", "\t");
    }

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense={useSuspense}>
                {children}
            </SQLiteProvider>
        </Suspense>
    );
}

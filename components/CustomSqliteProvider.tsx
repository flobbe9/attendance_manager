import migrations from "@/drizzle/migrations";
import {DATABASE_NAME, DRIZZLE_DB_CONFIG} from "@/utils/constants";
import {logDebug} from "@/utils/logUtils";
import {drizzle} from "drizzle-orm/expo-sqlite";
import {migrate, useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {openDatabaseSync, SQLiteProvider} from "expo-sqlite";
import {ReactNode, Suspense, useEffect} from "react";
import {ActivityIndicator} from "react-native";

interface Props {
    children: ReactNode;
    /** Default is ```true``` */
    useSuspense?: boolean;
}

export default function CustomSqliteProvider({children, useSuspense = true}: Props) {
    const sqliteSync = openDatabaseSync(DATABASE_NAME);
    const db = drizzle(sqliteSync, DRIZZLE_DB_CONFIG);
    const {error: migrationsError} = useMigrations(db, migrations);

    // drizzle dev tools
    if (process.env.NODE_ENV !== "production") useDrizzleStudio(sqliteSync);

    useEffect(() => {
        if (migrationsError) logDebug(migrationsError.message);
    }, [migrationsError]);

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider databaseName={DATABASE_NAME} options={{enableChangeListener: true}} useSuspense={useSuspense}>
                {children}
            </SQLiteProvider>
        </Suspense>
    );
}

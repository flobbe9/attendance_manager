import migrations from "@/drizzle/migrations";
import { DATABASE_NAME } from "@/utils/constants";
import { log, logDebug } from "@/utils/logUtils";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { ReactNode, Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";

interface Props {
    children: ReactNode,
    /** Default is ```true``` */
    useSuspense?: boolean
}


export default function CustomSqliteProvider({children, useSuspense = true}: Props) {

    const db = openDatabaseSync(DATABASE_NAME);
    const drizzleDb = drizzle(db, { casing: 'snake_case' });
    const { error } = useMigrations(drizzleDb, migrations);
    
    // drizzle dev tools
    if (process.env.NODE_ENV !== 'production')
        useDrizzleStudio(db);

    useEffect(() => {
        if (error)
            logDebug(error);
    }, [error])

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense={useSuspense}
            >
                {children}
            </SQLiteProvider>
        </Suspense>
    )
}
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import { logErrorFiltered, logWarnFiltered } from "@/utils/logUtils";
import { Stack } from "expo-router";


/**
 * Initialize global stuff in here.
 * 
 * @since 0.0.1
 */
export default function layout() {

    console.warn = logWarnFiltered;
    console.error = logErrorFiltered;

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <Stack 
                    screenOptions={{
                        headerShown: false, 
                        orientation: "all", 
                    }} 
                />
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import IndexContextProvider from "@/components/context/IndexContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { logErrorFiltered, logWarnFiltered } from "@/utils/logUtils";
import { Stack } from "expo-router";


console.warn = logWarnFiltered;
console.error = logErrorFiltered;


/**
 * Initialize global stuff in here.
 * 
 * @since 0.0.1
 */
export default function layout() {

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <IndexContextProvider>
                    <GlobalComponentProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false, 
                                orientation: "all", 
                            }} 
                            >
                            {/* <Stack.Screen name="(attendance)" /> */}
                        </Stack>
                    </GlobalComponentProvider>
                </IndexContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
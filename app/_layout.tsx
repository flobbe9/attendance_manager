import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import { Stack } from "expo-router";


/**
 * Initialize global stuff in here.
 * 
 * @since 0.0.1
 */
export default function layout() {

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <Stack 
                    screenOptions={{
                        headerShown: false, 
                        orientation: "all", 
                        presentation: "modal"
                    }} 
                />
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
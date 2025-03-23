import IndexContextProvider from "@/components/context/IndexContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";


/**
 * Initialize stuff in here.
 * 
 * @since 0.0.1
 */
export default function layout() {
    
    return (
        <CustomSqliteProvider>
            <IndexContextProvider>
                <Stack screenOptions={{headerShown: false}} />
            </IndexContextProvider>
        </CustomSqliteProvider>
    );
}
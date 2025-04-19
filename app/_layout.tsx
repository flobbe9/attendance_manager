import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import HelperText from "@/components/helpers/HelperText";
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
            <GlobalContextProvider>
                <Stack screenOptions={{headerShown: false}} />
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
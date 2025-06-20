import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import GlobalAttendanceContextProvider from "@/components/context/GlobalAttendanceContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { logErrorFiltered, logWarnFiltered } from "@/utils/logUtils";
import { Stack } from "expo-router";
import { ClickOutsideProvider } from "react-native-click-outside";
import { Text, View } from "react-native";


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
                <GlobalAttendanceContextProvider>
                    <ClickOutsideProvider>
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
                    </ClickOutsideProvider>
                </GlobalAttendanceContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
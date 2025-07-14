import GlobalAttendanceContextProvider from "@/components/context/GlobalAttendanceContextProvider";
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { logErrorFiltered, logWarnFiltered } from "@/utils/logUtils";
import { Stack } from "expo-router";
import { ClickOutsideProvider } from "react-native-click-outside";


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
                                    orientation: "default"
                                }}
                            >
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(attendance)" options={{animation: "slide_from_right"}} />
                                <Stack.Screen name="(settings)" options={{animation: "slide_from_left"}} />
                            </Stack>
                        </GlobalComponentProvider>
                    </ClickOutsideProvider>
                </GlobalAttendanceContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}
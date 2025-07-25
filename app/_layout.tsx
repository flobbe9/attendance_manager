import GlobalAttendanceContextProvider from "@/components/context/GlobalAttendanceContextProvider";
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { logErrorFiltered, logWarnFiltered } from "@/utils/logUtils";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { ClickOutsideProvider } from "react-native-click-outside";

console.warn = logWarnFiltered;
console.error = logErrorFiltered;

/**
 * Initialize global stuff in here.
 *
 * @since 0.0.1
 */
export default function layout() {
    const colorScheme = useColorScheme();

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <GlobalAttendanceContextProvider>
                    <ClickOutsideProvider>
                        <GlobalComponentProvider>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    statusBarStyle: colorScheme,
                                    orientation: "default",
                                }}
                            >
                                <Stack.Screen
                                    name="index"
                                    options={{
                                        headerShown: true,
                                        title: "Attendance Manager",
                                    }}
                                />
                                <Stack.Screen name="(attendance)" options={{ animation: "slide_from_right" }} />
                                <Stack.Screen name="(settings)" options={{ animation: "slide_from_left" }} />
                            </Stack>
                        </GlobalComponentProvider>
                    </ClickOutsideProvider>
                </GlobalAttendanceContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}

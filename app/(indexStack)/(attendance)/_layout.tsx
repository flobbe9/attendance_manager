import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import AttendanceContextProvider from "@/components/context/AttendanceContextProvider";
import HeaderBackButton from "@/components/HeaderBackButton";
import B from "@/components/helpers/B";
import { Stack } from "expo-router";

/**
 * @since 0.0.1
 */
export default function layout() {
    return (
        <AttendanceContextProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: () => <B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Unterrichtsbesuch</B>,
                    }}
                />
            </Stack>
        </AttendanceContextProvider>
    );
}

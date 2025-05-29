import AttendanceContextProvider from "@/components/context/AttendanceContextProvider";
import { Stack } from "expo-router";


/**
 * @since 0.0.1
 */
export default function layout() {

    return (
        <AttendanceContextProvider>      
            <Stack screenOptions={{
                headerShown: true,
            }}>
                <Stack.Screen 
                    name="index" 
                    options={{
                        title: "Unterrichtsbesuch"
                    }} 
                />
            </Stack>
        </AttendanceContextProvider>
    );
}

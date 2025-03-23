import { Stack } from "expo-router";


/**
 * @since 0.0.1
 */
export default function layout() {
    
    return (
        <Stack>
            <Stack.Screen 
                name="index" 
                options={{
                    title: "Unterrichtsbesuch"
                }} 
            />
        </Stack>
    );
}
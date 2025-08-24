import { Stack } from "expo-router";

/**
 * @since 0.2.2
 */
export default function layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "App Testing",
                }}
            />
        </Stack>
    );
}

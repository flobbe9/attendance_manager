import HeaderBackButton from "@/components/HeaderBackButton";
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
                    headerLeft: (props) => <HeaderBackButton />,
                    title: "App Testing",
                }}
            />
        </Stack>
    );
}

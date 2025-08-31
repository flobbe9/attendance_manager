import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import B from "@/components/helpers/B";
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
                    headerTitle: () => (<B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Einstellungen</B>)
                }}
            />
        </Stack>
    );
}

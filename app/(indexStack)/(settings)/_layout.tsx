import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import B from "@/components/helpers/B";
import Flex from "@/components/helpers/Flex";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { Stack } from "expo-router";

/**
 * @since 0.1.0
 */
export default function layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: (props) => (
                        <B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Einstellungen</B>
                    ),
                }}
            />

            <Stack.Screen
                name="popups"
                options={{
                    headerTitle: (props) => (
                        <B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Popups</B>
                    ),
                }}
            />

            <Stack.Screen
                name="backup"
                options={{
                    headerTitle: (props) => (
                        <B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Backup</B>
                    ),
                }}
            />

            <Stack.Screen
                name="appInfo"
                options={{
                    headerTitle: (props) => (
                        <B style={{ ...LayoutStyles.headerContent, marginStart: LayoutStyles.headerTitleNegativeOffset }}>Über diese App</B>
                    ),
                }}
            />
        </Stack>
    );
}

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
                        <Flex alignItems="center" {...props}>
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Einstellungen</B>
                        </Flex>
                    ),
                }}
            />

            {/* <Stack.Screen
                name="account"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <FontAwesome name="info-circle" style={{ ...LayoutStyles.headerIcon }} size={FONT_SIZE_LARGER} />
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Konto</B>
                        </Flex>
                    ),
                }}
            /> */}

            <Stack.Screen
                name="popups"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Popups</B>
                        </Flex>
                    ),
                }}
            />

            <Stack.Screen
                name="backup"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Backup</B>
                        </Flex>
                    ),
                }}
            />

            <Stack.Screen
                name="appInfo"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Über diese App</B>
                        </Flex>
                    ),
                }}
            />
        </Stack>
    );
}

import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import AttendanceInputErrorPopupIcon from "@/components/(attendance)/AttendanceInputErrorPopupIcon";
import B from "@/components/helpers/B";
import Flex from "@/components/helpers/Flex";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";

/**
 * @since 0.1.0
 */
export default function layout() {
    return (
        <Stack
            screenOptions={{
                animation: "slide_from_left",
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <FontAwesome name="gear" style={{ ...LayoutStyles.headerIcon }} size={FONT_SIZE_LARGER} />
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
                            <AttendanceInputErrorPopupIcon style={{ ...LayoutStyles.headerIcon }} size={FONT_SIZE_LARGER} />
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Popups</B>
                        </Flex>
                    ),
                }}
            />

            <Stack.Screen
                name="appInfo"
                options={{
                    headerTitle: (props) => (
                        <Flex alignItems="center" {...props}>
                            <FontAwesome name="info-circle" style={{ ...LayoutStyles.headerIcon }} size={FONT_SIZE_LARGER} />
                            <B style={{ fontSize: FONT_SIZE_LARGER }}>Über die App</B>
                        </Flex>
                    ),
                }}
            />
        </Stack>
    );
}

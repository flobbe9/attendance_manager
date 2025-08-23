import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import AssetProvider from "@/components/context/AssetProvider";
import GlobalAttendanceContextProvider from "@/components/context/GlobalAttendanceContextProvider";
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { APP_NAME, ENV } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { StatusBar, useColorScheme } from "react-native";
import { ClickOutsideProvider } from "react-native-click-outside";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/**
 * Initialize global stuff in here.
 *
 * @since 0.0.1
 * @edited latest make this a drawer nav
 */
export default function layout() {
    const colorScheme = useColorScheme();

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <GlobalAttendanceContextProvider>
                    <ClickOutsideProvider>
                        <AssetProvider>
                            <GlobalComponentProvider>
                                <GestureHandlerRootView style={{ flex: 1 }}>
                                    <StatusBar barStyle={`${colorScheme}-content`} />

                                    <Drawer>
                                        <Drawer.Screen
                                            name="index"
                                            options={{
                                                drawerItemStyle: { display: "none" }, // hide index in drawer item list, use back buttons instead
                                                title: APP_NAME,
                                            }}
                                        />

                                        <Drawer.Screen
                                            name="(settings)"
                                            options={{
                                                headerShown: false,
                                                drawerIcon: () => <FontAwesome name="gear" style={LayoutStyles.drawerIcon} />,
                                                title: "Einstellungen",
                                            }}
                                        />

                                        <Drawer.Screen
                                            name="(appTesting)"
                                            options={{
                                                headerShown: false,
                                                drawerIcon: () => <FontAwesome name="flask" style={LayoutStyles.drawerIcon} />,
                                                title: "App testing",
                                                drawerItemStyle: {
                                                    display: ENV !== "production" ? undefined : "none",
                                                },
                                            }}
                                        />

                                        <Drawer.Screen
                                            name="(attendance)"
                                            options={{
                                                headerShown: false,
                                                drawerItemStyle: { display: "none" },
                                            }}
                                        />
                                    </Drawer>
                                </GestureHandlerRootView>
                            </GlobalComponentProvider>
                        </AssetProvider>
                    </ClickOutsideProvider>
                </GlobalAttendanceContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}

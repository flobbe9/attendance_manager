import AssetProvider from "@/components/context/AssetProvider";
import GlobalAttendanceContextProvider from "@/components/context/GlobalAttendanceContextProvider";
import GlobalContextProvider from "@/components/context/GlobalContextProvider";
import IndexContextProvider from "@/components/context/IndexContextProvider";
import CustomSqliteProvider from "@/components/CustomSqliteProvider";
import DrawerContent from "@/components/DrawerContent";
import GlobalComponentProvider from "@/components/GlobalComponentProvider";
import { Drawer } from "expo-router/drawer";
import { StatusBar, useColorScheme } from "react-native";
import { ClickOutsideProvider } from "react-native-click-outside";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/**
 * Initialize global stuff in here.
 *
 * @since 0.0.1
 * @edited 0.2.5 make this a drawer nav
 */
export default function layout() {
    const colorScheme = useColorScheme();

    return (
        <CustomSqliteProvider>
            <GlobalContextProvider>
                <IndexContextProvider>
                    <GlobalAttendanceContextProvider>
                        <ClickOutsideProvider>
                            <AssetProvider>
                                <GlobalComponentProvider>
                                    <GestureHandlerRootView style={{ flex: 1 }}>
                                        <StatusBar barStyle={`${colorScheme}-content`} />

                                        <Drawer
                                            drawerContent={() => <DrawerContent />}
                                            screenOptions={{
                                                swipeEnabled: false,
                                                headerShown: false, // see (indexStack)/_layout for open drawer button
                                            }}
                                        />
                                    </GestureHandlerRootView>
                                </GlobalComponentProvider>
                            </AssetProvider>
                        </ClickOutsideProvider>
                    </GlobalAttendanceContextProvider>
                </IndexContextProvider>
            </GlobalContextProvider>
        </CustomSqliteProvider>
    );
}

import { combineDynamicStyles } from "@/abstract/DynamicStyle";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import CustomScreenHeader from "@/components/CustomScreenHeader";
import B from "@/components/helpers/B";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import { APP_NAME } from "@/utils/constants";
import { LIGHT_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation, useSegments } from "expo-router";

/**
 * Initialize global stuff in here. See (drawer) screens for index files
 *
 * @since 0.0.1
 * @edited 0.2.3 make this a drawer nav
 */
export default function layout() {
    const pathNames = useSegments();
    const navigation = useNavigation();

    function openDrawer(): void {
        navigation.dispatch(DrawerActions.openDrawer());
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: pathNames.length <= 1,
                    title: APP_NAME,
                    header: () => (
                        <CustomScreenHeader
                            leftContent={
                                <HelperButton
                                    dynamicStyle={combineDynamicStyles(HelperButtonStyles.minimalistic, LayoutStyles.drawerButton)}
                                    containerStyles={LayoutStyles.drawerButtonContainer}
                                    ripple={{ rippleBackground: LIGHT_COLOR }}
                                    onPress={openDrawer}
                                >
                                    {/* wrap inside helper text for button flex to apply */}
                                    <HelperText>
                                        <FontAwesome name="bars" style={{ ...LayoutStyles.headerContent }} />
                                    </HelperText>
                                </HelperButton>
                            }
                            centerContent={<B style={{ ...LayoutStyles.headerContent }}>{APP_NAME}</B>}
                        />
                    ),
                }}
            />

            <Stack.Screen name="(settings)" />

            <Stack.Screen name="(appTesting)" />

            <Stack.Screen name="(attendance)" />
        </Stack>
    );
}

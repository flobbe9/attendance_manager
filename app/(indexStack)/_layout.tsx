import { combineDynamicStyles } from "@/abstract/DynamicStyle";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import B from "@/components/helpers/B";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { APP_NAME } from "@/utils/constants";
import { logDebug } from "@/utils/logUtils";
import { DEFAULT_BUTTON_PADDING, FONT_SIZE_LARGER, LIGHT_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Stack, useNavigation, useSegments } from "expo-router";
import { Fragment, useEffect } from "react";

/**
 * Initialize global stuff in here. See (drawer) screens for index files
 *
 * @since 0.0.1
 * @edited 0.2.3 make this a drawer nav
 */
export default function layout() {
    const pathNames = useSegments();
    const navigation = useNavigation();

    const { prs } = useResponsiveStyles();

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
                    headerLeft: () => (
                        <HelperButton 
                            dynamicStyle={combineDynamicStyles(HelperButtonStyles.minimalistic, LayoutStyles.drawerButton)} 
                            ripple={{rippleBackground: LIGHT_COLOR}}
                            onPress={openDrawer}
                        >
                            {/* wrap inside helper text for button flex to apply */}
                            <HelperText>
                                <FontAwesome name="bars" style={{ ...LayoutStyles.headerContent }}  />
                            </HelperText>
                        </HelperButton>
                    ),
                    headerTitle: () => (<B style={{...LayoutStyles.headerContent, ...prs("ms_2")}}>{APP_NAME}</B>)
                }}
            />

            <Stack.Screen name="(settings)" />

            <Stack.Screen name="(appTesting)" />

            <Stack.Screen name="(attendance)" />
        </Stack>
    );
}

import HelperProps from "@/abstract/HelperProps";
import { DefaultComponentStyles } from "@/assets/styles/DefaultComponentStyles";
import { DrawerContentStyles } from "@/assets/styles/DrawerContentStyles";
import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FontAwesome } from "@expo/vector-icons";
import { ExternalPathString, Href, Link, RelativePathString, useNavigation, useRouter } from "expo-router";
import React, { JSX, ReactNode } from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperText from "./helpers/HelperText";
import Flex from "./helpers/Flex";
import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import HelperButton from "./helpers/HelperButton";
import { GLOBAL_SCREEN_PADDING, LIGHT_COLOR } from "@/utils/styleConstants";
import HelperStyles from "@/assets/styles/helperStyles";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * The content of the navigation drawer.
 *
 * @since latest
 */
export default function DrawerContent({ ...props }: Props) {
    const componentName = "DrawerContent";
    const { children, ...otherProps } = useHelperProps(props, componentName, DrawerContentStyles.component);
    const { navigate } = useRouter();

    function DrawerLinkButton({ href, iconName, label }: { href: Href; iconName: FontAweSomeIconname; label: string }) {
        return (
            <HelperButton 
                dynamicStyle={DrawerContentStyles.linkButton}  
                ripple={{rippleBackground: LIGHT_COLOR}} 
                onPress={() => navigate(href as any)} 
            >
                <FontAwesome
                    name={iconName}
                    style={{
                        ...DrawerContentStyles.linkButtonContent,
                        ...DrawerContentStyles.icon,
                    }}
                />
                <HelperText style={DrawerContentStyles.linkButtonContent}>{label}</HelperText>
            </HelperButton>
        );
    }

    return (
        <HelperView {...otherProps}>
            <DrawerLinkButton href={"/(indexStack)/(settings)"} iconName="gear" label="Einstellungen" />

            <DrawerLinkButton href={"/(indexStack)/(appTesting)"} iconName="flask" label="App Testing" />

            {children}
        </HelperView>
    );
}

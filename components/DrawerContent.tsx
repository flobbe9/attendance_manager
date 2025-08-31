import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import HelperProps from "@/abstract/HelperProps";
import { DrawerContentStyles } from "@/assets/styles/DrawerContentStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { LIGHT_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperButton from "./helpers/HelperButton";
import HelperText from "./helpers/HelperText";

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

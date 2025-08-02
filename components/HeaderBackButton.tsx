import HelperProps from "@/abstract/HelperProps";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import { LayoutStyles } from "@/assets/styles/LayoutStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperButton from "./helpers/HelperButton";

interface Props extends HelperProps<ViewStyle>, ViewProps {

}

/**
 * The 'headerLeft' back button. See any _layout.tsx file.
 * 
 * @since latest
 */
export default function HeaderBackButton({...props}: Props) {
    const navigation = useNavigation();

    const componentName = "HeaderBackButton";
    const { children, ...otherProps } = useHelperProps(props, componentName);
    
    return (
        <HelperButton 
            dynamicStyle={HelperButtonStyles.minimalistic} 
            onPress={() => navigation.goBack()}
            {...otherProps}
        >
            <FontAwesome name="arrow-left" style={{...LayoutStyles.headerIcon}} />
        </HelperButton>
    );
}
import HelperProps from "@/abstract/HelperProps";
import { ToastDefaultFooterStyles } from "@/assets/styles/ToastDefaultFooterStyles";
import Flex from "@/components/helpers/Flex";
import { useHelperProps } from "@/hooks/useHelperProps";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperButton from "./helpers/HelperButton";
import HelperText from "./helpers/HelperText";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    onDimiss: () => void,
    buttonStyles?: ViewStyle
}


/**
 * @since 0.0.1
 */
export default function ToastDimissFooter({onDimiss, buttonStyles, ...props}: Props) {

    const componentName = "ToastDismissFooter";
    const { children, ...otherProps } = useHelperProps(props, componentName, ToastDefaultFooterStyles.component);

    return (
        <Flex justifyContent="flex-end" alignItems="center" {...otherProps}>
            {children}
            
            <HelperButton dynamicStyle={ToastDefaultFooterStyles.button} onPress={onDimiss} style={buttonStyles}>
                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Cancel</HelperText>
            </HelperButton> 
        </Flex>
    )
}
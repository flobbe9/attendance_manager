import HelperProps from "@/abstract/HelperProps";
import { ToastDefaultFooterStyles } from "@/assets/styles/ToastDefaultFooterStyles";
import Flex from "@/components/helpers/Flex";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperButton from "./helpers/HelperButton";
import HelperText from "./helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { GlobalContext } from "./context/GlobalContextProvider";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * @since 0.0.1
 */
export default function ToastDefaultFooter({ onConfirm, onCancel, ...props }: Props) {
    const { prs } = useContext(GlobalContext);
    const componentName = "ToastDefaultFooter";
    const { children, ...otherProps } = useHelperProps(props, componentName, ToastDefaultFooterStyles.component);

    return (
        <Flex justifyContent="flex-end" alignItems="flex-end" {...otherProps}>
            {children}

            <HelperButton dynamicStyle={ToastDefaultFooterStyles.button} style={{ ...prs("me_2") }} onPress={onCancel}>
                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Cancel</HelperText>
            </HelperButton>

            <HelperButton dynamicStyle={ToastDefaultFooterStyles.button} onPress={onConfirm}>
                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Confirm</HelperText>
            </HelperButton>
        </Flex>
    );
}

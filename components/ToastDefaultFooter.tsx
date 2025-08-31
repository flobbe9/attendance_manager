import HelperProps from "@/abstract/HelperProps";
import { ToastDefaultFooterStyles } from "@/assets/styles/ToastDefaultFooterStyles";
import Flex from "@/components/helpers/Flex";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { GlobalContext } from "./context/GlobalContextProvider";
import HelperButton from "./helpers/HelperButton";
import HelperText from "./helpers/HelperText";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    onConfirm: () => void;
    onCancel: () => void;
    /** Only show cancel button and ignore `onConfirm`. Default is `false` */
    hideConfirmButton?: boolean;
}

/**
 * @since 0.0.1
 */
export default function ToastDefaultFooter({
    onConfirm,
    onCancel,
    hideConfirmButton = false,
    ...props
}: Props) {
    const { prs } = useContext(GlobalContext);
    const componentName = "ToastDefaultFooter";
    const { children, ...otherProps } = useHelperProps(
        props,
        componentName,
        ToastDefaultFooterStyles.component
    );

    return (
        <Flex justifyContent="flex-end" alignItems="flex-end" {...otherProps}>
            {children}

            <HelperButton dynamicStyle={ToastDefaultFooterStyles.button} onPress={onCancel}>
                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Cancel</HelperText>
            </HelperButton>

            <HelperButton
                dynamicStyle={ToastDefaultFooterStyles.button}
                rendered={!hideConfirmButton}
                style={{ ...prs("ms_2") }}
                onPress={onConfirm}
            >
                <HelperText dynamicStyle={ToastDefaultFooterStyles.buttonChildren}>Confirm</HelperText>
            </HelperButton>
        </Flex>
    );
}

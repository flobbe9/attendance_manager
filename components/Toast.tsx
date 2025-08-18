import HelperProps from "@/abstract/HelperProps";
import { ToastStyles } from "@/assets/styles/ToastStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { ReactNode, useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { Modal, Portal } from "react-native-paper";
import HelperScrollView from "./helpers/HelperScrollView";
import HelperText from "./helpers/HelperText";
import ToastDefaultFooter from "./ToastDefaultFooter";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import HelperReactChildren from "./helpers/HelperReactChildren";
import { logDebug } from "@/utils/logUtils";
import { GlobalContext } from "./context/GlobalContextProvider";
import { NotificationSevirity } from "@/abstract/NotificationSevirity";
import { NOTIFICATION_SEVIRITY_STYLES } from "@/utils/styleConstants";

export interface GlobalToastProps {
    /** Applied to outer container */
    outerStyle?: ViewStyle;
    /* Applied to scrollview wrapping the `content`. Remember to specify height and width explicitly for scroll to work */
    childrenContainerStyle?: ViewStyle;
    /**
     * Render a default footer with cancel and confirm buttons. To use a custom footer, set this to `false`
     * and pass children. Default is `true`
     */
    defaultFooter?: boolean;
    /**
     * Indicates to hide toast on dismiss. Includes footer buttons, touch outside and android's back button.
     * Notice that setting this to `false` may result in an unescapable toast. In that case, overridden `onCancel` or
     * `onConfirm` should hide the toast.
     * Default is `true`
     */
    hideOnDismiss?: boolean;
    /** Determines the toast style. Default is 'info' */
    sevirity?: NotificationSevirity;
    /** See {@link ToastDefaultFooter}. Only works for `defaultFooter`. Hides toast, defined or not */
    onConfirm?: () => void;
    /** See {@link ToastDefaultFooter}. Only works for `defaultFooter`. Hides toast, defined or not */
    onCancel?: () => void;
    /** Called when toast closes, no matter how. */
    onDismiss?: () => void;
    visible: boolean;
    content: ReactNode;
    /** For defining a custom footer */
    children?: ReactNode;
}

interface Props extends HelperProps<ViewStyle>, ViewProps, GlobalToastProps {
    hideToast: () => void;
}

/**
 * Centered popup message overlaying the whole screen.
 *
 * @since 0.0.1
 */
export default function Toast({
    outerStyle = {},
    childrenContainerStyle = {},
    visible,
    hideOnDismiss = true,
    defaultFooter = true,
    sevirity = "info",
    content,
    hideToast,
    onCancel,
    onConfirm,
    onDismiss,
    ...props
}: Props) {
    const { prs } = useContext(GlobalContext);

    const componentName = "Toast";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, ToastStyles.component);

    function handleDimsiss(): void {
        if (onDismiss) onDismiss();

        if (hideOnDismiss) hideToast();
    }

    function handleCancel(): void {
        if (onCancel) onCancel();

        handleDimsiss();
    }

    function handleConfirm(): void {
        if (onConfirm) onConfirm();

        handleDimsiss();
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                contentContainerStyle={{
                    ...(style as object),
                    ...NOTIFICATION_SEVIRITY_STYLES[sevirity],
                    ...(outerStyle as object),
                }}
                onDismiss={handleDimsiss}
                {...otherProps}
            >
                <HelperScrollView dynamicStyle={ToastStyles.childrenContainer} style={childrenContainerStyle}>
                    <HelperReactChildren>{content}</HelperReactChildren>
                </HelperScrollView>

                <HelperReactChildren>{children}</HelperReactChildren>

                <ToastDefaultFooter
                    style={{ ...prs("mt_2") }}
                    rendered={defaultFooter}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            </Modal>
        </Portal>
    );
}

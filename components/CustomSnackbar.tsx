import { SnackbarStyles } from "@/assets/styles/SnackbarStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { isBlank } from "@/utils/utils";
import React from "react";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";


export type CustomSnackbarStatus = "error" | "warn" | "info" | "default";

export type CustomnSnackbarProps = SnackbarProps & { status: CustomSnackbarStatus };

interface Props extends CustomnSnackbarProps {
}


/**
 * Native bottom popup with action button, slightly customized.
 * 
 * Hides automatically even when duration is falsy.
 * 
 * @since 0.0.1
 */
export default function CustomSnackbar(
    {
        status = "default",
        action = {label: "Cancel"},
        ...props
    }: Props
) {

    const componentName = "Snackbar";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, SnackbarStyles.component);

    const { labelStyle, ...otherActions } = action;

    return (
        <Portal>
            <Snackbar
                style={{
                    ...style as object,
                    ...SnackbarStyles[status],
                }}
                action={{
                    labelStyle: {
                        ...(!isBlank(otherActions.label) ? SnackbarStyles.label : {}),
                        color: status !== "default" ? "black" : otherActions.textColor,
                        ...labelStyle as object
                    },
                    ...otherActions,
                }}
                {...otherProps}
            >
                {children}
            </Snackbar>
        </Portal>
    )
}
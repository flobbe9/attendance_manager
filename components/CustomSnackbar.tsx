import { SnackbarStyles } from "@/assets/styles/SnackbarStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { BORDER_RADIUS, BORDER_WIDTH } from "@/utils/styleConstants";
import { isBlank } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";


export type CustomSnackbarStatus = "error" | "warn" | "info";

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
        status = "info",
        action = {label: ""},
        ...props
    }: Props
) {

    const componentName = "Snackbar";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, SnackbarStyles.component);


    return (
        <Portal>
            <Snackbar
                style={{
                    ...style as object,
                    ...SnackbarStyles[status],
                }}
                action={{
                    ...action,
                    labelStyle: {
                        ...(!isBlank(action.label) ? SnackbarStyles.label : {}),
                        color: status !== "info" ? "black" : action.textColor
                    },
                }}
                {...otherProps}
            >
                {children}
            </Snackbar>
        </Portal>
    )
}
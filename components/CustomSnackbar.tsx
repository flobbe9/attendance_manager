import { CustomSnackbarStyles } from "@/assets/styles/CustomSnackbarStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { FONT_WEIGHT_BOLD } from "@/utils/styleConstants";
import { isBlank } from "@/utils/utils";
import React, { useContext } from "react";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";
import { AssetContext } from "./context/AssetProvider";

export type CustomSnackbarStatus = "error" | "warn" | "info" | "success" | "default";

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
    const { defaultFontStyles } = useContext(AssetContext);
    const componentName = "Snackbar";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, CustomSnackbarStyles.component);

    const { labelStyle, ...otherActions } = action;

    return (
        <Portal>
            <Snackbar
                style={{
                    ...style as object,
                    ...CustomSnackbarStyles[status],
                }}
                action={{
                    labelStyle: {
                        ...(!isBlank(otherActions.label) ? CustomSnackbarStyles.label : {}),
                        color: status !== "default" ? "black" : otherActions.textColor,
                        ...defaultFontStyles({fontWeight: FONT_WEIGHT_BOLD}),
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
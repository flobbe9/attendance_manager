import { NotificationSevirity } from "@/abstract/NotificationSevirity";
import { CustomSnackbarStyles } from "@/assets/styles/CustomSnackbarStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { FONT_WEIGHT_BOLD, NOTIFICATION_SEVIRITY_STYLES } from "@/utils/styleConstants";
import { isBlank } from "@/utils/utils";
import React, { useContext } from "react";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";
import { AssetContext } from "./context/AssetProvider";
import HelperReactChildren from "./helpers/HelperReactChildren";

export type CustomnSnackbarProps = SnackbarProps & { sevirity: NotificationSevirity };

interface Props extends CustomnSnackbarProps {}

/**
 * Native bottom popup with action button, slightly customized.
 *
 * Hides automatically even when duration is falsy.
 *
 * @since 0.0.1
 */
export default function CustomSnackbar({ sevirity = "info", action = { label: "Cancel" }, ...props }: Props) {
    const { defaultFontStyles } = useContext(AssetContext);
    const componentName = "Snackbar";
    const { children, style, ...otherProps } = useDefaultProps(
        props,
        componentName,
        CustomSnackbarStyles.component
    );

    const { labelStyle, ...otherActions } = action;

    return (
        <Portal>
            <Snackbar
                style={{
                    ...(style as object),
                    ...NOTIFICATION_SEVIRITY_STYLES[sevirity],
                }}
                action={{
                    labelStyle: {
                        ...(!isBlank(otherActions.label) ? CustomSnackbarStyles.label : {}),
                        color: sevirity !== "info" ? "black" : otherActions.textColor,
                        ...defaultFontStyles({fontWeight: FONT_WEIGHT_BOLD}),
                        ...labelStyle as object
                    },
                    ...otherActions,
                }}
                {...otherProps}
            >
                <HelperReactChildren>{children}</HelperReactChildren>
            </Snackbar>
        </Portal>
    );
}

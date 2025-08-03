import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import { logWarn } from "@/utils/logUtils";
import React, { Fragment, useEffect } from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface Props extends HelperProps<TextStyle>, TextProps {}

/**
 * Wont render children. Does not support animated styles.
 *
 * @since 0.0.1
 */
export default function Br({ rendered = true, onRender, ...props }: Props) {
    const componentName = "Br";
    const { children, style, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        if (rendered && onRender) onRender();

        if (children) logWarn("'<Br>' component wont render 'props.children'");
    }, []);

    if (!rendered) return <Fragment />;

    return <Text {...otherProps}>{""}</Text>;
}

import HelperProps from "@/abstract/HelperProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { Fragment, useEffect } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import HelperView from "@/components/helpers/HelperView";
import { logWarn } from "@/utils/logUtils";
import { useHelperProps } from "@/hooks/useHelperProps";

interface Props extends HelperProps<TextStyle>, TextProps {
    /** Whether to add an additional line break (2 in total then). Default is `true` */
    large?: boolean;
}

/**
 * Wont render children. Does not support animated styles.
 *
 * @since 0.0.1
 */
export default function Br({ rendered, large = true, onRender, ...props }: Props) {
    const componentName = "Br";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        if (rendered && onRender) onRender();

        if (children) logWarn("'<Br>' component wont render 'props.children'");
    }, []);

    if (!rendered) return <Fragment />;

    return <Text {...otherProps}>{large ? "\n" : ""}</Text>;
}

import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import HelperText, { HelperTextProps } from "./HelperText";
import { FONT_WEIGHT_BOLD } from "@/utils/styleConstants";

/**
 * ```<HelperText>``` with bold style.
 *
 * @see HelperText
 * @since 0.0.1
 */
export default forwardRef(function B({ ...props }: HelperTextProps, ref: Ref<Text>) {
    const componentName = "B";
    const { children, ...otherProps } = useHelperProps(props, componentName, {default: {fontWeight: FONT_WEIGHT_BOLD}});

    return (
        <HelperText ref={ref} {...otherProps}>
            {children}
        </HelperText>
    );
});

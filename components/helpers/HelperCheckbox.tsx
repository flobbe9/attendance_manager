import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FONT_SIZE } from "@/utils/styleConstants";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import React, { forwardRef, Ref } from "react";
import { TextStyle, View, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperView from "./HelperView";
import HelperReactChildren from "./HelperReactChildren";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    checked: boolean,
    setChecked: (checked: boolean) => void,
    /** Applied to the checkbox icon (the square and the square with checkmark) */
    iconStyle?: TextStyle,
    /** How to align children relative to checkbox icon. Default is "right" */
    labelAlign?: "right" | "left",
}


/**
 * Children are the label.
 * 
 * @since 0.0.1
 */
export default forwardRef(function HelperCheckbox(
    {
        checked,
        setChecked,
        iconStyle = {},
        labelAlign = "right",
        ...props
    }: Props,
    ref: Ref<View>
) {
    const componentName = "HelperCheckbox";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    const defaultFontSize = FONT_SIZE;

    return (
         <Flex
            ref={ref}
            alignItems="center"
            onTouchStart={() => setChecked(!checked)}
            {...otherProps}
        >
            <HelperReactChildren rendered={labelAlign === "left"}>{children}</HelperReactChildren>

            <HelperView
                style={{ 
                    width: (iconStyle.fontSize ?? defaultFontSize) + 10, // make sure that checked icon has enough space
                }}
            >
                <FontAwesome 
                    name={checked ? "check-square-o" : "square-o"}
                    size={iconStyle.fontSize || defaultFontSize}
                    color={iconStyle.color || 'rgb(150, 150, 150)'}
                />
            </HelperView>

            <HelperReactChildren rendered={labelAlign === "right"}>{children}</HelperReactChildren>
        </Flex>
    )
})
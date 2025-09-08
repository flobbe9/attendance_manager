import { HelperCheckboxStyles } from "@/assets/styles/HelperCheckboxStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FONT_SIZE } from "@/utils/styleConstants";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import React, { forwardRef, Ref } from "react";
import { GestureResponderEvent, TextStyle, View } from "react-native";
import HelperButton, { HelperButtonProps } from "./HelperButton";
import HelperReactChildren from "./HelperReactChildren";
import HelperView from "./HelperView";

interface Props extends HelperButtonProps {
    checked: boolean,
    setChecked: (checked: boolean) => void,
    /** Applied to the checkbox icon (the square and the square with checkmark) */
    iconStyle?: TextStyle,
    /** How to align children relative to checkbox icon. Default is "right" */
    labelAlign?: "right" | "left",
    disabled?: boolean
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
        disabled = false,
        onTouchStart,
        ...props
    }: Props,
    ref: Ref<View>
) {
    const componentName = "HelperCheckbox";
    const { children, ...otherProps } = useHelperProps(props, componentName, HelperCheckboxStyles.component);

    const defaultFontSize = FONT_SIZE;

    function handleTouchStart(event: GestureResponderEvent): void {
        if (disabled)
            return;
        
        if (onTouchStart)
            onTouchStart(event);

        setChecked(!checked);
    }

    return (
        <HelperButton
            ref={ref}
            ripple={null}
            disabled={disabled}
            onTouchStart={handleTouchStart}
            {...otherProps}
        >
            <HelperReactChildren rendered={labelAlign === "left"}>{children}</HelperReactChildren>

            <HelperView
                style={{ 
                    width: (iconStyle.fontSize ?? defaultFontSize) + 5, // make sure that checked icon has enough space
                }}
            >
                <FontAwesome 
                    name={checked ? "check-square-o" : "square-o"}
                    size={iconStyle.fontSize || defaultFontSize}
                    color={iconStyle.color || 'rgb(150, 150, 150)'}
                />
            </HelperView>

            <HelperReactChildren rendered={labelAlign === "right"}>{children}</HelperReactChildren>
        </HelperButton>
    )
})
import { combineDynamicStyles, DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { HelperInputStyles } from "@/assets/styles/HelperInputStyles";
import HS from "@/assets/styles/helperStyles";
import { useDynamicStyle } from "@/hooks/useDynamicStyle";
import { useHelperProps } from "@/hooks/useHelperProps";
import { logDebug, logTrace } from "@/utils/logUtils";
import React, { forwardRef, Fragment, Ref, useContext, useEffect, useImperativeHandle, useRef } from "react";
import {
    Animated,
    Keyboard,
    NativeSyntheticEvent,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    TextStyle,
    useAnimatedValue,
    ViewStyle,
} from "react-native";
import { AssetContext } from "../context/AssetProvider";

interface Props extends HelperProps<TextStyle>, TextInputProps {
    disabled?: boolean;
    /** Automatically called in `onChangeText`. Make `onChangeText` throw in order to prevent this (will be handled gracefully) */
    setValue?: (value: string) => void;
    /** Applied to the outer most tag of this component. Should only be used for positioning and component dimensions. */
    containerStyles?: DynamicStyle<ViewStyle>;
}

/**
 * @since 0.0.1
 */
export default forwardRef(function HelperInput(
    { rendered = true, disabled, containerStyles = {}, setValue, onRender, onChangeText: propsOnChangeText, ...props }: Props,
    ref: Ref<TextInput>
) {
    const { defaultFontStyles } = useContext(AssetContext);
    
    const componentRef = useRef<TextInput>(null);

    const animatedBackgroundColor = useAnimatedValue(0);

    const componentName = "HelperInput";
    const {
        children,
        onFocus: propsOnFocus,
        onBlur: propsOnBlur,
        style,
        ...otherProps
    } = useHelperProps<TextInputProps, TextStyle>(props, componentName, HelperInputStyles.component);

    const { eventHandlers: viewEventHandlers, currentStyles: viewStyles } = useDynamicStyle(
        combineDynamicStyles(HelperInputStyles.view, containerStyles),
        [
            HelperInputStyles.view.animatedDynamicStyles.backgroundColor(animatedBackgroundColor),
        ]
    );

    useImperativeHandle(ref, () => componentRef.current!, []);

    useEffect(() => {
        // unfocus input on keyboard hide
        Keyboard.addListener("keyboardDidHide", () => componentRef.current?.blur());

        if (onRender) onRender();

        return () => {
            Keyboard.removeAllListeners("keyboardDidHide");
        };
    }, []);

    if (!rendered) return <Fragment />;

    function onChangeText(value: string): void {
        try {
            if (propsOnChangeText) propsOnChangeText(value);

            // intended not to call setValue
        } catch (e) {
            if (e.message) logTrace(e.message);

            return;
        }

        if (setValue) setValue(value);
    }

    function onFocus(event: NativeSyntheticEvent<TextInputFocusEventData>): void {
        if (propsOnFocus) propsOnFocus(event);

        viewEventHandlers.onFocus();
    }

    function onBlur(event: NativeSyntheticEvent<TextInputFocusEventData>): void {
        if (propsOnBlur) propsOnBlur(event);

        viewEventHandlers.onBlur();
    }

    return (
        <Animated.View style={viewStyles}>
            <TextInput
                ref={componentRef}
                editable={!disabled}
                selectTextOnFocus={false}
                placeholderTextColor={"rgb(125, 125, 125)"}
                style={{
                    ...(disabled ? HS.disabled : {}),
                    ...(style as object),
                    // NOTE: props returned by this method will not maintain state
                    ...defaultFontStyles(style as TextStyle)
                }}
                returnKeyType={otherProps.multiline ? "none" : "default"}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                {...otherProps}
            />

            {children}
        </Animated.View>
    );
});

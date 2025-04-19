import HelperProps from "@/abstract/HelperProps";
import { useDynamicStyles } from "@/hooks/useDynamicStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, KeyboardTypeOptions, NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, useAnimatedValue, View, ViewStyle } from "react-native";
import HelperView from "./HelperView";
import { getAnimatedBackgroundColorProp, HelperInputStyles } from "@/assets/styles/HelperInputStyles";
import { combineDynamicStyles, DynamicStyles } from "@/abstract/DynamicStyles";
import HelperText from "./HelperText";
import { HelperStyles } from "@/assets/styles/helperStyles";


interface Props extends HelperProps<TextStyle>, TextInputProps {
    disabled?: boolean
    setValue?: (value: string) => void,
    containerStyles?: DynamicStyles<ViewStyle>
}


/**
 * @since 0.0.1
 */
export default forwardRef(function HelperInput(
    {
        rendered = true,
        disabled,
        containerStyles,
        setValue,
        onRender,
        onChangeText: onChangeTextProps,
        ...props
    }: Props, 
    ref: Ref<TextInput>
) {

    const componentRef = useRef<TextInput>(null);

    const animatedBackgroundColor = useAnimatedValue(0);
    
    const componentName = "HelperInput";
    const { children, onFocus: propsOnFocus, onBlur: propsOnBlur, style, ...otherProps } = useHelperProps<TextInputProps, TextStyle>(props, componentName, HelperInputStyles.component);
    const { eventHandlers: viewEventHandlers, currentStyles: viewStyles } = useDynamicStyles(
        combineDynamicStyles(HelperInputStyles.view, containerStyles), 
        {}, 
        [getAnimatedBackgroundColorProp(animatedBackgroundColor)]
    );

    
    useImperativeHandle(ref, () => componentRef.current!, []);


    useEffect(() => {
        if (onRender)
            onRender();
    }, []);

    
    if (!rendered)
        return <Fragment />;


    function onChangeText(value: string): void {

        if (onChangeTextProps)
            onChangeTextProps(value);

        if (setValue)
            setValue(value);
    }


    function onFocus(event: NativeSyntheticEvent<TextInputFocusEventData>): void {

        if (propsOnFocus)
            propsOnFocus(event);

        viewEventHandlers.onFocus();
    }
    

    function onBlur(event: NativeSyntheticEvent<TextInputFocusEventData>): void {

        if (propsOnBlur)
            propsOnBlur(event);

        viewEventHandlers.onBlur(); 
    }


    return (
        <Animated.View style={viewStyles}>
            <TextInput
                ref={ref}
                editable={!disabled}
                selectTextOnFocus={!disabled}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                style={{
                    ...(disabled ? HelperStyles.disabled : {}),
                    ...style as object,
                }}
                returnKeyType={otherProps.multiline ? "none" : "default"}
                {...otherProps}
            />

            {children}
        </Animated.View>
    )
})
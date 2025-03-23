import HelperProps from "@/abstract/HelperProps";
import "@/assets/styles/HelperTextInputStyles";
import { getAnimatedBackgroundColorProp, HelperTextInputStyles } from "@/assets/styles/HelperTextInputStyles";
import { useDynamicStyles } from "@/hooks/useDynamicStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref, useImperativeHandle, useRef } from "react";
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, useAnimatedValue } from "react-native";
import HelperView from "./HelperView";


interface Props extends HelperProps<TextStyle>, TextInputProps {
    disabled?: boolean
    value: string,
    setValue: (value: string) => void,
}


/**
 * @since 0.0.1
 */
export default forwardRef(function HelperTextInput({
    rendered,
    disabled,
    value,
    setValue,
    onRender,
    onChangeText: onChangeTextProps,
    ...props
}: Props, ref: Ref<TextInput>) {

    const componentRef = useRef<TextInput>(null);

    const animatedBackgroundColor = useAnimatedValue(0);
    
    const componentName = "HelperTextInput";
    const { onFocus: propsOnFocus, onBlur: propsOnBlur, ...otherProps } = useHelperProps<TextInputProps, TextStyle>(props, componentName, HelperTextInputStyles.component);
    const { eventHandlers: viewEventHandlers, currentStyles: viewStyles } = useDynamicStyles(HelperTextInputStyles.view, {}, [getAnimatedBackgroundColorProp(animatedBackgroundColor)])

    
    useImperativeHandle(ref, () => componentRef.current!, []);


    function onChangeText(value: string): void {

        if (onChangeTextProps)
            onChangeTextProps(value);

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
        <HelperView style={viewStyles} onRender={onRender} rendered={rendered}>
            <TextInput 
                ref={ref}
                editable={!disabled}
                selectTextOnFocus={!disabled}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                {...otherProps}
            />
        </HelperView>
    )
})
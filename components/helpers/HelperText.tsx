import { AnimatedDynamicStyle } from '@/abstract/AnimatedDynamicStyle';
import { DynamicStyle } from '@/abstract/DynamicStyle';
import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, Text, TextProps, TextStyle } from "react-native";


interface Props extends HelperProps<TextStyle>, TextProps {}


/**
 * ```<Text>``` which Supports dynamic and animated text styles.
 * 
 * @see DynamicStyle
 * @see AnimatedDynamicStyle 
 * @since 0.0.1
 */
export default forwardRef(function HelperText(
    {
        dynamicStyle = {},
        animatedDynamicStyles,
        rendered = true,
        onRender,
        ...props
    }: Props,
    ref: Ref<Text>
) {

    if (rendered === false)
        return <Fragment />;

    const { children, ...otherProps } = useHelperProps(props, undefined, dynamicStyle, animatedDynamicStyles);

    const componentRef = useRef<Text>(null);

    useImperativeHandle(ref, () => componentRef.current!, []);

    useEffect(() => {
        if (onRender)
            onRender();    

    }, []);    

    return (
        <Animated.Text ref={componentRef} {...otherProps}>
            {children}
        </Animated.Text>
    )
})
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
 * Set `numberOfLines` to 1 in order to achive an ellipsis effect. Parent containers width may need to be set.
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
    const { children, ...otherProps } = useHelperProps(props, undefined, dynamicStyle, animatedDynamicStyles);
    
    const componentRef = useRef<Text>(null);
    
    useImperativeHandle(ref, () => componentRef.current!, []);
    
    
    useEffect(() => {
        if (rendered && onRender)
            onRender();    
        
    }, []);    


    if (rendered === false)
        return <Fragment />;


    return (
        <Animated.Text ref={componentRef} {...otherProps}>
            {children}
        </Animated.Text>
    )
})
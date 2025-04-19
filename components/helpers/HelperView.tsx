import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, View, ViewProps, ViewStyle } from "react-native";
import HelperProps from "../../abstract/HelperProps";


interface Props extends HelperProps<ViewStyle>, ViewProps {
}


/**
 * Convenient ```<View>``` that can handle dynamic styles as well as animated styles. See also {@link HelperProps}.
 * 
 * @since 0.0.1
 */
export default forwardRef(function HelperView(
    {
        dynamicStyles = {},
        animatedStyles,
        rendered = true,
        onRender,
        ...props
    }: Props,
    ref: Ref<View>
) {

    const { children, ...otherProps } = useHelperProps(props, undefined, dynamicStyles, animatedStyles);

    const componentRef = useRef<View>(null);

    useImperativeHandle(ref, () => componentRef.current!, []);


    useEffect(() => {
        if (onRender)
            onRender();    

    }, []);    
    

    if (!rendered)
        return <Fragment />


    return (
        <Animated.View ref={componentRef} {...otherProps}>
            {children}
        </Animated.View>
    )
})
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, ScrollView, ScrollViewProps, ViewStyle } from "react-native";
import HelperProps from "../../abstract/HelperProps";


interface Props extends HelperProps<ViewStyle>, ScrollViewProps {
    childrenContainerStyle?: ViewStyle
}


/**
 * Convenient ```<ScrollView>``` that can handle dynamic styles as well as animated styles. See also {@link HelperProps}.
 * 
 * @since 0.0.1
 */
export default forwardRef(function HelperScrollView(
    {
        dynamicStyle = {},
        childrenContainerStyle,
        animatedDynamicStyles,
        rendered = true,
        onRender,
        ...props
    }: Props,
    ref: Ref<ScrollView>
) {

    if (rendered === false)
        return <Fragment />;

    const { children, ...otherProps } = useHelperProps(props, undefined, dynamicStyle, animatedDynamicStyles);

    const componentRef = useRef<ScrollView>(null);

    useImperativeHandle(ref, () => componentRef.current!, []);


    useEffect(() => {
        if (onRender)
            onRender();    

    }, []);
    

    return (
        <Animated.ScrollView ref={componentRef} contentContainerStyle={childrenContainerStyle} {...otherProps}>
            {children}
        </Animated.ScrollView>
    )
})
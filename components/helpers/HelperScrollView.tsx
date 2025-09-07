import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, ScrollView, ScrollViewProps, ViewStyle } from "react-native";
import HelperProps from "../../abstract/HelperProps";
import { HelperScrollViewStyles } from "@/assets/styles/HelperScrollViewStyles";


interface Props extends HelperProps<ViewStyle>, ScrollViewProps {
    childrenContainerStyle?: ViewStyle
}


/**
 * Convenient ```<ScrollView>``` that can handle dynamic styles as well as animated styles. See also {@link HelperProps}.
 * 
 * For sticky element use `stickyHeaderIndices`. Refers to child indices.
 * 
 * @since 0.0.1
 */
export default forwardRef(function HelperScrollView(
    {
        childrenContainerStyle,
        rendered = true,
        onRender,
        ...props
    }: Props,
    ref: Ref<ScrollView>
) {
    const componentName = "HelperScrollView";
    const { children, ...otherProps } = useHelperProps(props, componentName, HelperScrollViewStyles.component);
    
    const componentRef = useRef<ScrollView>(null);
    
    useImperativeHandle(ref, () => componentRef.current!, []);
    
    
    useEffect(() => {
        if (onRender && rendered)
            onRender();    
        
    }, []);
    

    if (rendered === false)
        return <Fragment />;


    return (
        <Animated.ScrollView ref={componentRef} contentContainerStyle={childrenContainerStyle} persistentScrollbar {...otherProps}>
            {children}
        </Animated.ScrollView>
    )
})
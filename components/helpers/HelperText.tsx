import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref, useContext, useEffect, useImperativeHandle, useRef } from "react";
import { Animated, Text, TextProps, TextStyle } from "react-native";
import { AssetContext } from "../context/AssetProvider";


export interface HelperTextProps extends HelperProps<TextStyle>, TextProps {
    /** Alias for `numberOfLines: 1` */
    ellipsis?: boolean
}


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
        ellipsis = false,
        rendered = true,
        onRender,
        ...props
    }: HelperTextProps,
    ref: Ref<Text>
) {
    const { defaultFontStyles } = useContext(AssetContext);
    const componentName = "HelperText";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, {
        default: {
            // TODO: continue here
                // make sure this is applied to
                    // icons (?)
                    // label components
                        // radiobutton
                        // checkbox
                        // select (?)
                        // sectioned input
        }
    });
    
    const componentRef = useRef<Text>(null);
    
    useImperativeHandle(ref, () => componentRef.current!, []);
    
    useEffect(() => {
        if (rendered && onRender)
            onRender();    
    }, []);    


    if (rendered === false)
        return <Fragment />;

    return (
        <Animated.Text 
            ref={componentRef} 
            numberOfLines={ellipsis ? 1 : undefined} 
            style={{
                ...style as object,
                // NOTE: props returned by this method will not maintain state
                ...defaultFontStyles(style as TextStyle),
            }}
            {...otherProps}
        >
            {children}
        </Animated.Text>
    )
})
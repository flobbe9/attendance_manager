import HelperProps from "@/abstract/HelperProps";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import { HelperStyles } from "@/assets/styles/helperStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref } from "react";
import { ColorValue, TouchableNativeFeedback, View, ViewProps, ViewStyle } from "react-native";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    disabled?: boolean
    /** Configure the ripple effect on press. Defaults to a blue variant. Pass ```null``` to disable the ripple effect */
    ripple?: { rippleBackground: ColorValue } | null
}


/**
 * Should act like a button, is actually a ```<HelperView>``` supporting a ripple effect and dynamic and animated styles.
 *  
 * @since 0.0.1
 */
export default forwardRef(function HelperButton(
    {
        disabled,
        ripple = { rippleBackground: "#1d85da"}, // light blueish
        ...props
    }: Props,
    ref: Ref<View>
) {

    const componentName = "HelperButton";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, HelperButtonStyles.component);


    function Parent({children}) {

        return (ripple && !disabled ? 
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(ripple.rippleBackground, false)}>
                {children}
            </TouchableNativeFeedback>
            :
            <Fragment>
                {children}
            </Fragment>
        )
    }

    
    return (
        <Parent>
            <HelperView 
                ref={ref}
                style={{
                    ...style as object,
                    ...(disabled ? HelperStyles.disabled : {})
                }}
                {...otherProps}
            >
                {children}
            </HelperView>
        </Parent>
    )
})
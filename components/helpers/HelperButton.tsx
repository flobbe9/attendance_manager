import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import HS from "@/assets/styles/helperStyles";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useDynamicStyle } from "@/hooks/useDynamicStyle";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref } from "react";
import { ActivityIndicator, ActivityIndicatorIOSProps, ColorValue, GestureResponderEvent, TouchableNativeFeedback, View, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperView from "./HelperView";


export interface HelperButtonProps extends HelperProps<ViewStyle>, ViewProps {
    disabled?: boolean
    /** Configure the ripple effect on press. ```undefined``` will make the ripple color adjust to the current background color. ```null``` will disable the ripple effect */
    ripple?: { rippleBackground: ColorValue } | null,
    /** Applied to the outer most tag of this component. Should only be used for positioning and component dimensions. */
    containerStyles?: DynamicStyle<ViewStyle>,
    /** For this component to be a child of a ```<Link>```. Is passed to ```<TouchableNativeFeedback>```  */
    onPress?: (event?: GestureResponderEvent) => void,
    /** Whether button children container is not flex. Default is ```false```. */
    disableFlex?: boolean,
    /** Renders a loading indicator while `true`. Also disabled the button. Use `loadingProps` to style the indicator. Defualt is `false` */
    loading?: boolean,
    loadingProps?: ActivityIndicatorIOSProps
}


/**
 * Should act like a button, is actually a ```<HelperView>``` supporting a ripple effect and dynamic and animated styles.
 *  
 * @since 0.0.1
 */
export default forwardRef(function HelperButton(
    {
        disabled,
        ripple,
        containerStyles,
        disableFlex = false,
        loading = false,
        loadingProps = {},
        onPress,
        onLayout,
        ...props
    }: HelperButtonProps,
    ref: Ref<View>
) {

    const componentName = "HelperButton";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, HelperButtonStyles.component);

    const { currentStyles: componentStyles, eventHandlers: containerEventHandlers } = useDynamicStyle(containerStyles);

    const { animatedStyle: anmimatedOpacity } = useAnimatedStyle(
        [50, 100],
        [0.5, 1],
        {
            reverse: disabled || loading,
            startReversed: !disabled && !loading
        }
    )

    function handlePress(event?: GestureResponderEvent): void {
        if (!disabled && !loading && onPress)
            onPress(event);
    }

    return (
        <HelperView 
            style={{
                // prevent corner leaks of ripple effect
                borderRadius: (style as ViewStyle).borderRadius, 
                overflow: "hidden",
                ...HS.fitContent,
                ...componentStyles,
            }}
            onLayout={onLayout}
            {...containerEventHandlers}
        >
            <TouchableNativeFeedback 
                onPress={handlePress} 
                background={ripple === null || disabled || loading ? null : TouchableNativeFeedback.Ripple(ripple?.rippleBackground, false)}
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    disableFlex={disableFlex}
                    ref={ref}
                    style={{
                        ...style as object,
                        opacity: anmimatedOpacity
                    }}
                    {...otherProps}
                >
                    {
                        loading && 
                        <ActivityIndicator
                            animating={true} 
                            {...loadingProps}
                            style={{...HelperButtonStyles.loadingIndicator, ...loadingProps.style as object}}
                        />
                    }
                    
                    {children}
                </Flex>
            </TouchableNativeFeedback>
        </HelperView>
    )
})
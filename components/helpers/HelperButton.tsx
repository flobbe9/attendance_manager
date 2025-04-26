import HelperProps from "@/abstract/HelperProps";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import HS from "@/assets/styles/helperStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref } from "react";
import { ColorValue, GestureResponderEvent, Platform, TouchableNativeFeedback, View, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperView from "./HelperView";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { useDynamicStyle } from "@/hooks/useDynamicStyle";
import { log } from "@/utils/logUtils";
import { AnimatedFAB } from "react-native-paper";


export interface HelperButtonProps extends HelperProps<ViewStyle>, ViewProps {
    disabled?: boolean
    /** Configure the ripple effect on press. ```undefined``` will make the ripple color adjust to the current background color. ```null``` will disable the ripple effect */
    ripple?: { rippleBackground: ColorValue } | null,
    /** Applied to the outer most tag of this component. Should only be used for positioning and component dimensions. */
    containerStyles?: DynamicStyle<ViewStyle>,
    /** For this component to be a child of a ```<Link>```. Is passed to ```<TouchableNativeFeedback>```  */
    onPress?: (event?: GestureResponderEvent) => void,
    /** Whether button children container is not flex. Default is ```false```. */
    disableFlex?: boolean
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
        onPress,
        onLayout,
        ...props
    }: HelperButtonProps,
    ref: Ref<View>
) {

    const componentName = "HelperButton";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, HelperButtonStyles.component);

    const { currentStyles: componentStyles, eventHandlers: containerEventHandlers } = useDynamicStyle(containerStyles);

    function handlePress(event?: GestureResponderEvent): void {

        if (!disabled && onPress)
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
                background={ripple === null || disabled ? null : TouchableNativeFeedback.Ripple(ripple?.rippleBackground, false)}
            >
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    disableFlex={disableFlex}
                    ref={ref}
                    style={{
                        ...style as object,
                        ...(disabled ? HS.disabled : {})
                    }}
                    {...otherProps}
                >
                    {children}
                </Flex>
            </TouchableNativeFeedback>
        </HelperView>
    )
})
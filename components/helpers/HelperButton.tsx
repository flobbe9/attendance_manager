import HelperProps from "@/abstract/HelperProps";
import { HelperButtonStyles } from "@/assets/styles/HelperButtonStyles";
import { HelperStyles } from "@/assets/styles/helperStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref } from "react";
import { ColorValue, GestureResponderEvent, TouchableNativeFeedback, View, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperView from "./HelperView";
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { useDynamicStyles } from "@/hooks/useDynamicStyles";
import { log } from "@/utils/logUtils";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    disabled?: boolean
    /** Configure the ripple effect on press. ```undefined``` will make the ripple color adjust to the current background color. ```null``` will disable the ripple effect */
    ripple?: { rippleBackground: ColorValue } | null,
    /** Applied to the outer most tag of this component. Should only be used for positioning and component dimensions. */
    containerStyles?: DynamicStyles<ViewStyle>,
    /** For this component to be a child of a ```<Link>```. Is passed to ```<TouchableNativeFeedback>```  */
    onPress?: (event?: GestureResponderEvent) => void
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
        onPress,
        ...props
    }: Props,
    ref: Ref<View>
) {

    const componentName = "HelperButton";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, HelperButtonStyles.component);

    const { currentStyles: componentStyles, eventHandlers: containerEventHandlers } = useDynamicStyles(containerStyles);

    return (
        <HelperView 
            style={{
                // prevent corner leaks of ripple effect
                borderRadius: (style as ViewStyle).borderRadius, 
                overflow: "hidden",
                ...HelperStyles.fitContent,
                ...componentStyles,
            }}
            {...containerEventHandlers}
        >
            <TouchableNativeFeedback onPress={onPress} background={ripple === null ? null : TouchableNativeFeedback.Ripple(ripple?.rippleBackground, false)}>
                <Flex
                    horizontalAlign="center"
                    verticalAlign="center"
                    ref={ref}
                    style={{
                        ...style as object,
                        ...(disabled ? HelperStyles.disabled : {})
                    }}
                    {...otherProps}
                >
                    {children}
                </Flex>
            </TouchableNativeFeedback>
        </HelperView>
    )
})
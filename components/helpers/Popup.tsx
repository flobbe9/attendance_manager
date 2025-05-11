import HelperProps from "@/abstract/HelperProps";
import { PopupStyles } from "@/assets/styles/PopupStyles";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React, { ReactNode } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperText from "./HelperText";
import HelperView from "./HelperView";


export type GlobalPopupProps = PopupProps & { duration?: number};

interface PopupProps {
    message: ReactNode,
    visible: boolean,
    /** Rendered on the left of children */
    icon?: ReactNode,
    /** Applied to component, not to children */
    containerStyle?: ViewStyle
}

interface Props extends HelperProps<ViewStyle>, ViewProps, PopupProps {}


/**
 * Subtle box displayed at bottom of screen, fading out automatically.
 * 
 * @since 0.0.1
 */
export default function Popup({
    icon,
    visible,
    message,
    containerStyle = {},
    ...props
}: Props) {

    const componentName = "Popup";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, PopupStyles.component);

    const { animatedStyle } = useAnimatedStyle(
        [0, 100],
        [0, 1],
        !visible,
    )

    const { allStyles: { pe_1 }, parseResponsiveStyleToStyle: pR} = useResponsiveStyles();


    return (
        <Flex 
            style={{
                ...style as object,
                zIndex: visible ? 0 : -1 // make sure hidden popup does not overlay anything
            }}
            justifyContent="center" 
            {...otherProps}
        >
            <Flex
                alignItems="center"
                dynamicStyle={PopupStyles.container}
                style={{
                    opacity: animatedStyle,
                    ...containerStyle
                }}
            >
                <HelperView style={{...pR({pe_1})}} rendered={!!icon}>
                    {icon}
                </HelperView>

                {typeof message === "string" ? <HelperText>{message}</HelperText> : message}

                {children}
            </Flex>
        </Flex>
    )
}
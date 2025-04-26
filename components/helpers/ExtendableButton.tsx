import { ExtendableButtonStyles } from "@/assets/styles/ExtendableButtonStyles";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { TRANSITION_DURATION } from "@/utils/styleConstants";
import React, { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import HelperButton, { HelperButtonProps } from "./HelperButton";
import HelperView from "./HelperView";


interface Props extends HelperButtonProps {
    isExtended: boolean
    setExtended?: (extended: boolean) => void,
    /** Default is 200. The starting width is taken from `style.width` */
    extendedWidth?: number,

    label?: ReactNode

    /** Default is "center" */
    align?: "flex-start" | "flex-end" | "center",
}


/**
 * Needs starting and ending with passed as magic numbers. Notice that the button width must be a numeric value
 * 
 * @since 0.0.1
*/
export default forwardRef(function ExtendableButton(
    {
        label,
        isExtended,
        extendedWidth = 200,
        align = "center",
        ...props
    }: Props,
    ref: Ref<View>) {

    const { allStyles } = useResponsiveStyles();

    const componentRef = useRef<View>(null);
    const labelRef = useRef<View>(null);
    useImperativeHandle(ref, () => componentRef.current, []);

    const [labelStyle, setLabelStyle] = useState<ViewStyle>({});

    const animationDuration = TRANSITION_DURATION;
    
    const componentName = "ExtendableButton";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, ExtendableButtonStyles.component);

    const defaultCollapsedButtonWidth = 60;
    const { animatedStyle: animatedButtonWidth } = useAnimatedStyle(
        [0, 200],
        [extendedWidth, typeof (style as ViewStyle).width === "number" ? (style as ViewStyle).width  as number : defaultCollapsedButtonWidth], // cannot be a function for some reason
        isExtended,
        [isExtended],
        animationDuration
    )


    useEffect(() => {
        updateLabelStyle();

    }, [isExtended, allStyles]);


    function getLabelMargin(): ViewStyle {

        if (align === "flex-end")
            return allStyles.me_2;

        if (align === "flex-start")
            return allStyles.ms_2;

        return {...allStyles.ms_2, ...allStyles.me_2};
    }


    /**
     * Hide or show the label.
     */
    function updateLabelStyle(): void {

        if (props.disabled)
            return;

        const labelStyle: ViewStyle = {
            opacity: isExtended ? 1 : 0,
            position: isExtended ? "static" : "absolute",
        }

        setTimeout(() => {
            setLabelStyle(labelStyle);
        }, isExtended ? TRANSITION_DURATION : 0);         
    }


    return (
        <HelperButton
            id="Test"
            style={{
                ...style as object,
                justifyContent: align,
                width: props.disabled ? extendedWidth : animatedButtonWidth 
            }}
            ref={componentRef}
            {...otherProps}
        >
            <HelperView rendered={align !== "flex-end"}>
                {children}
            </HelperView>

            <HelperView 
                style={{...labelStyle, ...getLabelMargin()}}
                ref={labelRef}
            >
                {label}
            </HelperView>
            
            <HelperView rendered={align === "flex-end"}>
                {children}
            </HelperView>
        </HelperButton>
    )
})
import HelperProps from "@/abstract/HelperProps";
import { TooltipStyles } from "@/assets/styles/TooltipStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useScreenTouch } from "@/hooks/useScreenTouch";
import { isBooleanFalsy, isNumberFalsy } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TextStyle, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperText from "./HelperText";


export type TooltipIconAlign = "top" | "bottom" | "left" | "right";


interface Props extends HelperProps<ViewStyle>, ViewProps {

    /** Will only work if setter is defined as well */
    visible?: boolean,
    setVisible?: (visible: boolean) => void,
    /** Determines where to position the tooltip icon relative to the tooltip text. Default is 'left' */
    iconAlign?: TooltipIconAlign,
    /** 
     * Time (in ms) after which text hides automatically. Set to `undefined` or `NaN` in order to disable auto hide. 
     * Default is `5000`.
     */
    duration?: number,
    iconStyle?: TextStyle
}


/**
 * Icon with text box next to it which can be toggled by clicking the icon.
 * 
 * Will hide on blur but only if rendered inside a `ScreenWrapper`.
 * 
 * @since 0.0.1
 */
export default function Tooltip(
    {
        iconAlign = "left",
        visible,
        setVisible,
        duration = 5000,
        iconStyle = {},
        ...props
    }: Props
) {

    const iconSize = 20;
    const [visibleState, setVisibleState] = isBooleanFalsy(visible) || !setVisible ? useState(false) : [visible, setVisible];
    
    const [hideTextTimeout, setHideTextTimeout] = useState<NodeJS.Timeout>();
    
    const { animatedStyle } = useAnimatedStyle(
        [0, 100],
        [0, 1],
        {
            reverse: !visibleState,
            startReversed: visible
        }
    )

    const componentName = "Tooltip";
    const { children, ...otherProps } = useHelperProps(props, componentName, TooltipStyles.component);


    useEffect(() => {
        if (hideTextTimeout)
            clearTimeout(hideTextTimeout);

        if (visibleState && !isNumberFalsy(duration))
            setHideTextTimeout(setTimeout(() => setVisibleState(false), duration));

    }, [visibleState]);


    useScreenTouch(() => {
        hideTooltipOnScreenTouch();
    });


    function hideTooltipOnScreenTouch(): void {
        
        if (!visibleState)
            return;

        setTimeout(() => {
            setVisibleState(false);
        }, 100); // wait for icon press event to fire
    }


    function handleIconPress(_event): void {

        setVisibleState(!visibleState);
    }


    return (
        <Flex alignItems="center" justifyContent="center" {...otherProps}>
            <FontAwesome name="lightbulb-o" size={iconSize} style={{...TooltipStyles.icon, ...iconStyle}} onPress={handleIconPress}/> 

            <HelperView 
                dynamicStyle={TooltipStyles.textContainer} 
                style={{[iconAlign]: iconSize + Number(TooltipStyles.icon.padding), opacity: animatedStyle}}
            >
                <HelperText dynamicStyle={TooltipStyles.text}>
                    {children}
                </HelperText>
            </HelperView>
        </Flex>
    )
}
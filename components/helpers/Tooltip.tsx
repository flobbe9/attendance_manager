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
import HelperButton from "./HelperButton";
import { logDebug } from "@/utils/logUtils";
import { DEFAULT_BUTTON_PADDING, FONT_SIZE } from "@/utils/styleConstants";
import HelperStyles from "@/assets/styles/helperStyles";
import { DynamicStyle } from "@/abstract/DynamicStyle";


export type TooltipIconAlign = "top" | "bottom" | "left" | "right";


interface Props extends HelperProps<ViewStyle>, ViewProps {

    /** Will only work if setter is defined as well */
    visible?: boolean,
    setVisible?: (visible: boolean) => void,
    /** Determines where to position the tooltip icon relative to the tooltip text. Default is 'left' */
    iconAlign?: TooltipIconAlign,
    /** Amount to move the textcontainer in addition to the default value, e.g. to take larger button padding into account. Default is 0 */
    textContainerAdditionalOffset?: number,
    /** 
     * Time (in ms) after which text hides automatically. Set to `undefined` or `NaN` in order to disable auto hide. 
     * Default is `5000`.
     */
    duration?: number,
    iconStyle?: TextStyle,
    buttonStyles?: { containerStyles?: DynamicStyle<ViewStyle>, style?: ViewStyle }
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
        textContainerAdditionalOffset = 0,
        visible,
        setVisible,
        duration = 5000,
        iconStyle = {},
        buttonStyles = {},
        ...props
    }: Props
) {
    const [visibleState, setVisibleState] = isBooleanFalsy(visible) || !setVisible ? useState(false) : [visible, setVisible];
    
    const [hideTextTimeout, setHideTextTimeout] = useState<NodeJS.Timeout>();
    
    const { animatedStyle: animatedTextContainerOpacity } = useAnimatedStyle(
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
        setVisibleState(false);
    }

    function handlePress(_event): void {
        setTimeout(() => {
            setVisibleState(!visibleState);
        }, 100); // wait for screentouch handler to fire
    }

    /**
     * Move the text container to the other side of the icon button.
     *   
     * @returns the amount to move the text container
     */
    function getTextContainerOffset(): number {
        return (DEFAULT_BUTTON_PADDING * 2) + (iconStyle.fontSize ?? FONT_SIZE) + (textContainerAdditionalOffset ?? 0);
    }

    /**
     * Make sure that the text container will not overlap the icon if text gets longer.
     * 
     * @returns the opposite align of `iconAlign` 
     */
    function getTextContainerPositionKey(): TooltipIconAlign {
        switch (iconAlign) {
            case "right":
                return "left";

            case "left":
                return "right";

            case "top":
                return "bottom";

            case "bottom":
                return "top";
        }
    }

    return (
        <Flex alignItems="center" justifyContent="center" {...otherProps}>
            <HelperButton 
                dynamicStyle={TooltipStyles.iconButton} 
                style={buttonStyles.style}
                containerStyles={buttonStyles.containerStyles}
                onTouchStart={handlePress}
            >
                <FontAwesome 
                    name="lightbulb-o" 
                    style={{
                        ...iconStyle,
                    }}
                /> 
            </HelperButton>

            <HelperView 
                dynamicStyle={TooltipStyles.textContainer} 
                style={{
                    [getTextContainerPositionKey()]: getTextContainerOffset(),
                    opacity: animatedTextContainerOpacity
                }}
            >
                <HelperText dynamicStyle={TooltipStyles.text}>
                    {children}
                </HelperText>
            </HelperView>
        </Flex>
    )
}
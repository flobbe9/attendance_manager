import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { TooltipStyles } from "@/assets/styles/TooltipStyles";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useScreenTouch } from "@/hooks/useScreenTouch";
import { DEFAULT_BUTTON_PADDING, FONT_SIZE } from "@/utils/styleConstants";
import { isFalsy, isNumberFalsy } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TextStyle, ViewProps, ViewStyle } from "react-native";
import Flex from "./Flex";
import HelperButton from "./HelperButton";
import HelperReactChildren from "./HelperReactChildren";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends HelperProps<ViewStyle>, ViewProps {
    /** Will only work if setter is defined as well */
    visible?: boolean,
    setVisible?: (visible: boolean) => void,
    /** Determines where to position the tooltip relative to the tooltip icon. Default is 'left' */
    position?: TooltipPosition,
    /** Amount to move the textcontainer in addition to the default value, e.g. to take larger button padding into account. Default is 0 */
    textContainerAdditionalOffset?: number,
    /** 
     * Time (in ms) after which text hides automatically. Set to `undefined` or `NaN` in order to disable auto hide. 
     * Default is `5000`.
     */
    duration?: number,
    iconStyle?: TextStyle,
    buttonStyles?: { containerStyles?: DynamicStyle<ViewStyle>, style?: ViewStyle }
    textContainerStyles?: ViewStyle
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
        position = "left",
        textContainerAdditionalOffset = 5,
        visible,
        setVisible,
        duration = 5000,
        iconStyle = {},
        buttonStyles = {},
        textContainerStyles = {},
        ...props
    }: TooltipProps
) {
    const [visibleState, setVisibleState]: [boolean, (visible: boolean) => void] = isFalsy(visible) || !setVisible ? useState(false) : [visible, setVisible];
    
    const [hideTextTimeout, setHideTextTimeout] = useState<number>();

    const [textContainerDisplay, setTextContainerDisplay] = useState<undefined | "none">(!visible ? "none" : undefined);
    
    const { animatedStyle: animatedTextContainerOpacity, animate } = useAnimatedStyle(
        [0, 100],
        [0, 1],
        {
            reverse: !visibleState,
            startReversed: visibleState,
            animationDeps: null // dont handle animation inside hook
        }
    )

    const hasMounted = useHasComponentMounted(500);

    const componentName = "Tooltip";
    const { children, ...otherProps } = useHelperProps(props, componentName, TooltipStyles.component);

    useEffect(() => {
        animateTextContainerOpacity();
        
        if (hideTextTimeout)
            clearTimeout(hideTextTimeout);

        if (visibleState && !isNumberFalsy(duration))
            setHideTextTimeout(setTimeout(() => setVisibleState(false), duration));
    
    }, [visibleState]);

    useScreenTouch(() => {
        hideTooltipOnScreenTouch();
    });

    async function animateTextContainerOpacity(): Promise<void> {
        if (!hasMounted)
            return;

        if (visibleState) {
            setTextContainerDisplay(undefined);
            await animate(!visibleState);

        } else {
            await animate(!visibleState);
            setTextContainerDisplay("none");
        }
    }

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
        return (DEFAULT_BUTTON_PADDING * 2) + (iconStyle.fontSize ?? FONT_SIZE) + textContainerAdditionalOffset;
    }

    /**
     * Make sure that the text container will not overlap the icon if text gets longer.
     * 
     * @returns the opposite align of `position` 
     */
    function getTextContainerPositionKey(): TooltipPosition {
        switch (position) {
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
                style={{
                    position: "absolute",
                    [getTextContainerPositionKey()]: getTextContainerOffset(),
                }}
            >
                <HelperView 
                    dynamicStyle={TooltipStyles.textContainer} 
                    style={{
                        ...textContainerStyles,
                        opacity: animatedTextContainerOpacity,
                        display: textContainerDisplay
                    }}
                >
                    <HelperReactChildren dynamicStyle={TooltipStyles.text}>
                        {children}
                    </HelperReactChildren>
                </HelperView>
            </HelperView>
        </Flex>
    )
}
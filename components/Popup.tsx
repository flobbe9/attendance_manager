import HelperProps from "@/abstract/HelperProps";
import { PopupStyles } from "@/assets/styles/PopupStyles";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import Flex from "@/components/helpers/Flex";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React, { forwardRef, ReactNode, Ref, useContext, useEffect, useState } from "react";
import { GestureResponderEvent, Image, View, ViewProps, ViewStyle } from "react-native";
import favicon from "../assets/images/favicon-small-transparent.png";
import HelperReactChildren from "./helpers/HelperReactChildren";

export type GlobalPopupProps = PopupProps & {
    /** Time (in ms) after the popup fades out automatically. Set to `null` in order to disable auto hide. Default is 5000. */
    duration?: number;
};

interface PopupProps {
    message: ReactNode;
    visible: boolean;
    /** Rendered on the left of children */
    icon?: ReactNode;
    /** Applied to component, not to children */
    containerStyle?: ViewStyle;
}

interface Props extends HelperProps<ViewStyle>, ViewProps, PopupProps {}

/**
 * Subtle box displayed at bottom of screen, fading out automatically.
 *
 * @since 0.0.1
 */
export default forwardRef(function Popup({ icon, visible, message, containerStyle = {}, onTouchStart, ...props }: Props, ref: Ref<View>) {
    const orientation = useDeviceOrientation();

    const { hideGlobalPopup, globalPopupProps } = useContext(GlobalContext);

    // make sure hidden popup does not overlay anything
    const [componentZIndex, setComponentZIndex] = useState(-1);

    const componentName = "Popup";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, PopupStyles.component);

    const { animatedStyle, animate } = useAnimatedStyle([0, 100], [0, 1], {
        reverse: !visible,
        animationDeps: null,
    });

    const { prs } = useResponsiveStyles();

    useEffect(() => {
        handleFadeToggle();
    }, [visible]);

    async function handleFadeToggle(): Promise<void> {
        if (visible) setComponentZIndex(0);

        await animate(!visible);

        if (!visible) setComponentZIndex(-1);
    }

    /**
     * Hide self on touch
     *
     * @param event
     */
    function handleTouchStart(event: GestureResponderEvent): void {
        if (onTouchStart) onTouchStart(event);

        hideGlobalPopup(globalPopupProps);
    }

    return (
        <Flex
            style={{
                ...(style as object),
                zIndex: componentZIndex,
            }}
            justifyContent="center"
            ref={ref}
            onTouchStart={handleTouchStart}
            {...otherProps}
        >
            <Flex
                alignItems="center"
                flexWrap="nowrap"
                dynamicStyle={PopupStyles.container}
                style={{
                    maxWidth: orientation === "portrait" ? 300 : 500,
                    opacity: animatedStyle,
                    ...containerStyle,
                }}
            >
                <Image source={Image.resolveAssetSource(favicon)} style={{ ...PopupStyles.favicon, ...prs("me_1") }} />

                <HelperReactChildren dynamicStyle={PopupStyles.message}>{message}</HelperReactChildren>

                <HelperView style={{ ...prs("ms_1") }} rendered={!!icon}>
                    {icon}
                </HelperView>

                {children}
            </Flex>
        </Flex>
    );
});

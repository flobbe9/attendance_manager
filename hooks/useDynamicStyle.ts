import { AnimatedDynamicStyle } from "@/abstract/AnimatedDynamicStyle";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { logDebug, logWarn } from "@/utils/logUtils";
import { TRANSITION_DURATION } from "@/utils/styleConstants";
import { cloneObj, flatMapObject, isFalsy } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { useHasComponentMounted } from './useHasComponentMounted';


/**
 * Adds or removes certain styles uising eventhandlers. 
 * 
 * NOTE: both dynamic style objects are cloned to the deepest level which will result in them loosing their state. Use the normal ```props.style``` 
 * object for states. Notice that any ```props.style``` prop will always take precedence over any ```dynamicStyle``` prop, even the ones added by eventlistener. 
 * 
 * @param dynamicStyle the complete stylesheet including all dynamic styles, even if they shouldn't be applied on render
 * @param animmatedStyleProps list of styles that are supposed to be animated. This object needs both initial and final style values to be 
 * specified in given ```styles``` object. See {@link AnimatedDynamicStyle}
 * @returns some eventhandlers adding / removing their respective styles and a flat stylesheet state which is the modified style object to pass to 
 * the component
 * @since 0.0.1
 */
export function useDynamicStyle<StyleType>(
    dynamicStyle: DynamicStyle<StyleType> = {}, 
    animatedDynamicStyles?: AnimatedDynamicStyle<StyleType>[]
) {
    const hasComponentMounted = useHasComponentMounted();

    /** Copy of style objects that will only be altered for animated styles and for nothing else */
    const [initStyles, setInitStyles] = useState<DynamicStyle<StyleType>>(cloneObj(dynamicStyle, 2)); 
    /** To make sure `currentStyles` are only initialized once */
    const [currentStylesInitialized, setCurrentStylesInitialized] = useState(false);
    const [currentStyles, setCurrentStyles] = useState<DynamicStyle<StyleType>>(initAnimatedStyles());
    const [currentStylesFlat, setCurrentStylesFlat] = useState<StyleType>(initStyles.default);
    
    useEffect(() => {
        setCurrentStylesFlat(flatMapObject(currentStyles) as StyleType);
    }, [currentStyles]);

    /**
     * Replaces all default styles that need to be animated with an interpolated value for them to be triggered later on. Also 
     * removes those styles from their event object because they should not be added with ```addStyles()```. Only alters the
     * ```initStyles``` object, dont alter ```styles``` or ```propsStyles```!
     * 
     * @returns ```initStyles.default``` including interpolated values
     */
    function initAnimatedStyles(): DynamicStyle<StyleType> {
        if (currentStylesInitialized)
            return currentStyles;

        try {
            // case: initialized already or no styles to animate
            if (hasComponentMounted || !animatedDynamicStyles?.length)
                return {default: initStyles.default};

            animatedDynamicStyles.forEach(animatedDynamicStyle => {
                if (!initStyles[animatedDynamicStyle.event]) {
                    logWarn(`Missing styles for event '${animatedDynamicStyle.event}'`);
                    return;
                }

                const fromStyleValue = initStyles.default[animatedDynamicStyle.styleProp];
                const toStyleValue = initStyles[animatedDynamicStyle.event][animatedDynamicStyle.styleProp];

                if (isFalsy(fromStyleValue)) {
                    logWarn(`Missing 'fromStyleValue' for event '${animatedDynamicStyle.event}' and styleProp '${String(animatedDynamicStyle.styleProp)}'`);
                    return;
                }

                if (isFalsy(toStyleValue)) {
                    logWarn(`Missing 'toStyleValue' for event '${animatedDynamicStyle.event}' and styleProp '${String(animatedDynamicStyle.styleProp)}'`);
                    return;
                }

                const newValue = animatedDynamicStyle.animatedValue.interpolate({
                    inputRange: animatedDynamicStyle.inputRange,
                    outputRange: [fromStyleValue as any, toStyleValue]
                });
                
                // replace default style with animated one, ready to be triggered
                initStyles.default[animatedDynamicStyle.styleProp] = newValue as any;
                // remove event style from event object because its now in the default
                delete initStyles[animatedDynamicStyle.event][animatedDynamicStyle.styleProp];
            });

            return {default: initStyles.default};

        } finally {
            setCurrentStylesInitialized(true);
        }
    }

    function onFocus(): void {
        startAnimations("focus");
        startAnimations("blur", true);

        removeStyles("blur");
        addStyles("focus");
    }

    function onBlur(): void {
        startAnimations("blur");
        startAnimations("focus", true);

        removeStyles("focus");
        addStyles("blur");
    }

    function onTouchStart(): void {
        startAnimations("touchStart");

        addStyles("touchStart");
    }

    function onTouchEnd(): void {
        startAnimations("touchEnd");

        addStyles("touchEnd");
    }
        
    /**
     * NOTE: triggered only when onPress event is present
     */
    function onPressIn(): void {
        startAnimations("pressIn");
        startAnimations("pressOut", true);

        removeStyles("pressOut");
        addStyles("pressIn");
    }

    /**
     * NOTE: triggered only when onPress event is present
     */
    function onPressOut(): void {
        startAnimations("pressOut");
        startAnimations("pressIn", true);

        removeStyles("pressIn");
        addStyles("pressOut");
    }

    function addStyles(key: keyof DynamicStyle<StyleType>): void {
        if (!key || key === "animatedDynamicStyles")
            return;

        if (!initStyles[key])
            return;

        currentStyles[key] = initStyles[key];
        setCurrentStyles({...currentStyles});
    }

    function removeStyles(key: keyof DynamicStyle<StyleType>): void {
        if (!key || key === "animatedDynamicStyles")
            return;

        if (!initStyles[key])
            return;

        delete currentStyles[key];
        setCurrentStyles({...currentStyles});
    }

    /**
     * Trigger all registered animations (```animatedDynamicStyles```) with given ```event```.
     * 
     * @param eventName the event to trigger animations for
     * @param reverse indicates whether the animation's input range should be reversed, which will simply start the animation in reverse. Default is ```false```
     */
    function startAnimations(eventName: keyof DynamicStyle<StyleType>, reverse: boolean = false): void {
        if (!animatedDynamicStyles)
            return;
        
        animatedDynamicStyles
            .forEach(animatedDynamicStyle => {
                const inputRangeIndex = reverse ? 0 : animatedDynamicStyle.inputRange.length - 1;

                if (animatedDynamicStyle.event === eventName)
                    Animated.timing(
                        animatedDynamicStyle.animatedValue,
                        {
                            toValue: animatedDynamicStyle.inputRange[inputRangeIndex],
                            duration: animatedDynamicStyle.duration || TRANSITION_DURATION,
                            useNativeDriver: false
                        }
                    ).start();
            });
    }

    return {
        /** Pass these to the component in order for styles to dynamically be added or removed */
        eventHandlers: {
            onFocus,
            onBlur,
            onTouchStart,
            onTouchEnd,
            onPressIn,
            onPressOut
        },
        /** Add the styles with given key to the curentStyles state */
        addStyles,
        /** Remove the styles with given key from the curentStyles state */
        removeStyles,
        /** Pass this to the component (infer the type if necessary) */
        currentStyles: currentStylesFlat
    }
}
import { AnimatedStyleProp } from "@/abstract/AnimatedStyleProp";
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { log, logWarn } from "@/utils/logUtils";
import { TRANSITION_DURATION } from "@/utils/styleConstants";
import { cloneObj, flatMapObject, isAnyFalsy } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Animated, StyleProp } from "react-native";
import { useHasComponentMounted } from './useHasComponentMounted';


/**
 * Adds or removes certain styles for given ```styles``` using eventhandlers. 
 * 
 * NOTE: all style object are cloned to the deepest level which will result in them loosing their state. Use plain react-native components for that.
 * 
 * @param dynamicStyles the complete stylesheet including all dynamic styles, even if they shouldn't be applied on render
 * @param propsStyles the styles object passed to the component props of the component calling this hook. Will be added to default styles and 
 * overriden by dynamic styles
 * @param animmatedStyleProps list of styles that are supposed to be animated. This object needs both initial and final style values to be 
 * specified in given ```styles``` object. See {@link AnimatedStyleProp}
 * @returns some eventhandlers adding / removing their respective styles and a flat stylesheet state which is the modified style object to pass to 
 * the component
 * @since 0.0.1
 */
export function useDynamicStyles<StyleType>(
    dynamicStyles: DynamicStyles<StyleType> = {}, 
    propsStyles?: StyleProp<StyleType>,
    animatedStyleProps?: AnimatedStyleProp<StyleType>[]
) {

    const hasComponentMounted = useHasComponentMounted();

    /** Copy of style objects that will only be altered for animated styles and for nothing else */
    const [initStyles, setInitStyles] = useState<DynamicStyles<StyleType>>(cloneObj({...dynamicStyles, default: {...dynamicStyles.default, ...propsStyles as object}}, 2)); // somehow destructuring "propsStyles" on a deeper level than 1 will return a weird different object. So dont go further than 2 here
    const [currentStyles, setCurrentStyles] = useState<DynamicStyles<StyleType>>(initAnimatedStyles());
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
    function initAnimatedStyles(): DynamicStyles<StyleType> {

        // case: no styles to animate or initialized already
        if (hasComponentMounted || 
            !initStyles || !Object.keys(initStyles.default).length || 
            !animatedStyleProps || !animatedStyleProps.length)
            return {default: initStyles.default};

        animatedStyleProps.forEach(animatedStyleProp => {
            if (!initStyles[animatedStyleProp.event]) {
                logWarn(`Missing styles for event '${animatedStyleProp.event}'`);
                return;
            }

            const fromStyleValue = initStyles.default[animatedStyleProp.styleProp];
            const toStyleValue = initStyles[animatedStyleProp.event][animatedStyleProp.styleProp];

            if (isAnyFalsy(fromStyleValue)) {
                logWarn(`Missing 'fromStyleValue' for event '${animatedStyleProp.event}'`);
                return;
            }

            if (isAnyFalsy(toStyleValue)) {
                logWarn(`Missing 'toStyleValue' for event '${animatedStyleProp.event}'`);
                return;
            }

            const newValue = animatedStyleProp.animatedValue.interpolate({
                inputRange: animatedStyleProp.inputRange,
                outputRange: [fromStyleValue as any, toStyleValue]
            });
            
            // replace default style with animated one, ready to be triggered
            initStyles.default[animatedStyleProp.styleProp] = newValue as any;
            // remove event style from event object because its now in the default
            delete initStyles[animatedStyleProp.event][animatedStyleProp.styleProp];
        });

        return {default: initStyles.default};
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


    function addStyles(key: keyof DynamicStyles<StyleType>): void {

        if (!key)
            return;

        if (!initStyles[key])
            return;

        currentStyles[key] = initStyles[key];
        setCurrentStyles({...currentStyles});
    }


    function removeStyles(key: keyof DynamicStyles<StyleType>): void {

        if (!key)
            return;

        if (!initStyles[key])
            return;

        delete currentStyles[key];
        setCurrentStyles({...currentStyles});
    }


    /**
     * Trigger all registered animations (```animatedStyleProps```) with given ```event```.
     * 
     * @param eventName the event to trigger animations for
     * @param reverse indicates whether the animation's input range should be reversed, which will simply start the animation in reverse. Default is ```false```
     */
    function startAnimations(eventName: keyof DynamicStyles<StyleType>, reverse: boolean = false): void {

        if (!animatedStyleProps)
            return;
        
        animatedStyleProps
            .forEach(animatedStyleProp => {
                const inputRangeIndex = reverse ? 0 : animatedStyleProp.inputRange.length - 1;

                if (animatedStyleProp.event === eventName)
                    Animated.timing(
                        animatedStyleProp.animatedValue,
                        {
                            toValue: animatedStyleProp.inputRange[inputRangeIndex],
                            duration: animatedStyleProp.duration || TRANSITION_DURATION,
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
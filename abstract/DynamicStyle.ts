import { Animated } from "react-native";
import { AnimatedDynamicStyle } from "./AnimatedDynamicStyle";
import { PartialRecord } from "./PartialRecord";
import { isFalsy } from "@/utils/utils";

/**
 * Replaces css pseudo classes like ```:focus``` and ```:hover``` with respective mobile properties. 
 * 
 * Use ```useDynamicStyle``` or ```useDefaultProps``` to apply dynamic styles to any component.
 * 
 * NOTE: For any property added to this interface, an "add"- and "remove"-style event handler should be
 * added to the ```useDynamicStyle``` hook.
 * 
 * @since 0.0.1
 */
export interface DynamicStyle<StyleType> {
    /** The 'static' styles that are always applied */
    default?: StyleType
    /** For animating a styleprop which has been defined in "default" and for any event */
    animatedDynamicStyles?: PartialRecord<keyof StyleType, (animatedValue: Animated.Value) => AnimatedDynamicStyle<StyleType>>,
    
    focus?: StyleType
    blur?: StyleType
    touchStart?: StyleType,
    touchEnd?: StyleType,
    pressIn?: StyleType,
    pressOut?: StyleType,
}


/**
 * Creates one single object of given dynamic styles. ```dynamicStyle2``` props will have priority in case of duplicate props.
 * 
 * @param dynamicStyle1 
 * @param dynamicStyle2 
 * @returns single dynamic styles object (new instance)
 */
export function combineDynamicStyles<StyleType>(dynamicStyle1: DynamicStyle<StyleType>, dynamicStyle2: DynamicStyle<StyleType>): DynamicStyle<StyleType> {

    if (!dynamicStyle1 && !dynamicStyle2)
        return {};

    if (!dynamicStyle1)
        return dynamicStyle2;
    
    if (!dynamicStyle2)
        return dynamicStyle1;

    const combined: DynamicStyle<StyleType> = {};

    new Set([...Object.keys(dynamicStyle1), ...Object.keys(dynamicStyle2)])
        .forEach(key => {
            const dynamicStyle1Value = dynamicStyle1[key];
            const dynamicStyle2Value = dynamicStyle2[key];

            // case: only style 2
            if (!isFalsy(dynamicStyle2Value) && isFalsy(dynamicStyle1Value)) {
                combined[key] = dynamicStyle2Value;
                
            // case: only style 1
            } else if (!isFalsy(dynamicStyle1Value) && isFalsy(dynamicStyle2Value))
                combined[key] = dynamicStyle1Value;

            // case: both
            else
                combined[key] = {...dynamicStyle1Value, ...dynamicStyle2Value};
        });

    return combined;
}
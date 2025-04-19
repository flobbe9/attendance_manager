import { log } from "@/utils/logUtils";
import { isObjectFalsy } from "@/utils/utils";

/**
 * Replaces css pseudo classes like ```:focus``` and ```:hover``` with respective mobile properties. 
 * 
 * Use ```useDynamicStyles``` or ```useDefaultProps``` to apply dynamic styles to any component.
 * 
 * NOTE: For any property added to this interface, an "add"- and "remove"-style event handler should be
 * added to the ```useDynamicStyles``` hook.
 * 
 * @since 0.0.1
 */
export interface DynamicStyles<StyleType> {
    /** The 'static' styles that are always applied */
    default?: StyleType
    focus?: StyleType
    blur?: StyleType
    touchStart?: StyleType,
    touchEnd?: StyleType,
    pressIn?: StyleType,
    pressOut?: StyleType,
}


/**
 * Creates one single object of given dynamic styles. ```dynamicStyles2``` props will have priority in case of duplicate props.
 * 
 * @param dynamicStyles1 
 * @param dynamicStyles2 
 * @returns single dynamic styles object (new instance)
 */
export function combineDynamicStyles<StyleType>(dynamicStyles1: DynamicStyles<StyleType>, dynamicStyles2: DynamicStyles<StyleType>): DynamicStyles<StyleType> {

    if (!dynamicStyles1 && !dynamicStyles2)
        return {};

    if (!dynamicStyles1)
        return dynamicStyles2;
    
    if (!dynamicStyles2)
        return dynamicStyles1;

    const combined: DynamicStyles<StyleType> = {};

    new Set([...Object.keys(dynamicStyles1), ...Object.keys(dynamicStyles2)])
        .forEach(key => {
            const dynamicStyles1Value = dynamicStyles1[key];
            const dynamicStyles2Value = dynamicStyles2[key];

            // case: only style 1
            if (isObjectFalsy(dynamicStyles2Value)) {
                combined[key] = dynamicStyles1Value;
                
            // case: only style 2
            } else if (isObjectFalsy(dynamicStyles1Value))
                combined[key] = dynamicStyles2Value;

            // case: both
            else
                combined[key] = {...dynamicStyles1Value, ...dynamicStyles2Value};
        });

    return combined;
}
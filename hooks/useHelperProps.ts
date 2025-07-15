import { AnimatedDynamicStyle } from "@/abstract/AnimatedDynamicStyle";
import { combineDynamicStyles, DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { useDefaultProps } from "./useDefaultProps";


/**
 * Simply calls ```useDefaultProps``` but combining ```props.dynamicStyle``` with ```dynamicStyle``` and ```props.animatedStyles``` with ```animatedStyles```.
 * 
 * Use this instead of ```useDefaultProps``` if the component uses ```HelperProps```.
 * 
 * @see useDefaultProps
 * @since 0.0.1
 */
export function useHelperProps<PropsType, StyleType>(
    props: HelperProps<StyleType> & PropsType, 
    componentName?: string,
    dynamicStyle: DynamicStyle<StyleType> = {},
    animatedDynamicStyles: AnimatedDynamicStyle<StyleType>[] = [],
    componentNameAsId = false
): HelperProps<StyleType> & PropsType {

    /** Get rid of props.dynamicStyle as its handled seperatly */
    const { dynamicStyle: propsDynamicStyle, ...otherProps } = props;
    
    return useDefaultProps(
        otherProps as PropsType, 
        componentName, 
        combineDynamicStyles(dynamicStyle, propsDynamicStyle), 
        [...animatedDynamicStyles, ...(props.animatedDynamicStyles || [])], 
        componentNameAsId
    );
}
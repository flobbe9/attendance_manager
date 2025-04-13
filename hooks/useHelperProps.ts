import { AnimatedStyleProp } from "@/abstract/AnimatedStyleProp";
import { combineDynamicStyles, DynamicStyles } from "@/abstract/DynamicStyles";
import HelperProps from "@/abstract/HelperProps";
import { useEffect, useState } from "react";
import { useDynamicStyles } from "./useDynamicStyles";
import { useDefaultProps } from "./useDefaultProps";


/**
 * Simply calls ```useDefaultProps``` but combining ```props.dynamicStyles``` with ```dynamicStyles``` and ```props.animatedStyles``` with ```animatedStyles```.
 * 
 * Use this instead of ```useDefaultProps``` if the component uses ```HelperProps```.
 * 
 * @see useDefaultProps
 * @since 0.0.1
 */
export function useHelperProps<PropsType, StyleType>(
    props: HelperProps<StyleType> & PropsType, 
    componentName?: string,
    dynamicStyles: DynamicStyles<StyleType> = {},
    animatedStyles: AnimatedStyleProp<StyleType>[] = [],
    componentNameAsId = false,
    dontClonePropsStyle = false
): HelperProps<StyleType> & PropsType {

    /** Get rid of props.dynamicStyles as its handled seperatly */
    const { dynamicStyles: propsDynamicStyles, ...otherProps } = props;
    
    return useDefaultProps(
        otherProps as PropsType, 
        componentName, 
        combineDynamicStyles(dynamicStyles, propsDynamicStyles), 
        [...animatedStyles, ...(props.animatedStyles || [])], 
        componentNameAsId
    );
}
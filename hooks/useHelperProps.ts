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
): HelperProps<StyleType> & PropsType {

    return useDefaultProps(props, componentName, combineDynamicStyles(dynamicStyles, props.dynamicStyles), [...animatedStyles, ...(props.animatedStyles || [])], componentNameAsId);
}
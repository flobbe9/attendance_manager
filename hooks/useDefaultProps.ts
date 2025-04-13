import DefaultProps from "@/abstract/DefaultProps";
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { useEffect, useState } from "react";
import { useDynamicStyles } from "./useDynamicStyles";
import { log } from "@/utils/logUtils";
import { AnimatedStyleProp } from "@/abstract/AnimatedStyleProp";


/**
 * Will add ```componentName``` to ```props.id``` and ```props.className```. Will adjust some event handlers for ```dynamicStyles``` to take effect.
 * 
 * @param props to adjust
 * @param dynamicStyles style object for the component
 * @param animatedStyles list of styles that are supposed to be animated. This object needs both initial and final style values to be 
 * specified in given ```styles``` object. See {@link AnimatedStyleProp}
 * @param componentName to prepend to id and className
 * @param componentNameAsId if true, the ```componentName``` will be prepended to id. Default is ```false```
 * @type ```StyleType``` type of style the outer most tag of the component calling this hook needs (e.g. ```ViewStyle```). 
 * @type ```PropsType``` type of props of the component calling this hook (e.g. ```ViewProps```). 
 * @returns adjusted component props ready to be passed to component without any more changes 
 * @see {@link useDynamicStyles}
 * @since 0.0.1
 */
export function useDefaultProps<PropsType, StyleType>(
    props: DefaultProps<StyleType> & PropsType, 
    componentName = "",
    dynamicStyles: DynamicStyles<StyleType> = {},
    animatedStyles?: AnimatedStyleProp<StyleType>[],
    componentNameAsId = false,
): DefaultProps<StyleType> & PropsType {

    const { eventHandlers: dynamicStylesEventHandlers, currentStyles } = useDynamicStyles<StyleType>(
        dynamicStyles, 
        props.style, 
        animatedStyles
    );

    const [eventHandlers, setEvenHandlers] = useState({});

    
    useEffect(() => {
        setEvenHandlers(collectEventHandlers());

    }, []);


    /**
     * This will "clone" the event handler function causing it to loose it's state. Will only clone, if a dynamicStyle eventhandler
     * is present.
     * 
     * @returns event handler functions calling both the dynamic style callback and the props[eventHandler] callback
     */
    function collectEventHandlers(): object {

        if (!dynamicStyles)
            return {};

        const eventHandlers: object = {};

        Object.keys(dynamicStylesEventHandlers)
            .forEach(eventHandlerName => {
                // only reassign if dynamicstyle event handler is present
                if (dynamicStyles[eventHandlerName])
                    eventHandlers[eventHandlerName] = (event) => {
                        dynamicStylesEventHandlers[eventHandlerName]();

                        if (props[eventHandlerName])
                            props[eventHandlerName](event);
                    }
            });

        return eventHandlers;
    }

    return {
        ...props, // call this first in order to not override the other props
        ...eventHandlers,
        id: props.id || componentNameAsId ? componentName + (props.id || "") : undefined,
        className: componentName + " " + (props.className || ""),
        style: currentStyles
    };
}
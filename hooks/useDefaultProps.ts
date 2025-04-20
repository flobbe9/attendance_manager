import DefaultProps from "@/abstract/DefaultProps";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { useEffect, useState } from "react";
import { useDynamicStyle } from "./useDynamicStyle";
import { log } from "@/utils/logUtils";
import { AnimatedDynamicStyle } from "@/abstract/AnimatedDynamicStyle";


/**
 * Will add ```componentName``` to ```props.id``` and ```props.className```. Will adjust some event handlers for ```dynamicStyle``` to take effect.
 * 
 * @param props to adjust
 * @param dynamicStyle style object for the component
 * @param animatedStyles list of styles that are supposed to be animated. This object needs both initial and final style values to be 
 * specified in given ```styles``` object. See {@link AnimatedDynamicStyle}
 * @param componentName to prepend to id and className
 * @param componentNameAsId if true, the ```componentName``` will be prepended to id. Default is ```false```
 * @type ```StyleType``` type of style the outer most tag of the component calling this hook needs (e.g. ```ViewStyle```). 
 * @type ```PropsType``` type of props of the component calling this hook (e.g. ```ViewProps```). 
 * @returns adjusted component props ready to be passed to component without any more changes 
 * @see {@link useDynamicStyle}
 * @since 0.0.1
 */
export function useDefaultProps<PropsType, StyleType>(
    props: DefaultProps<StyleType> & PropsType, 
    componentName = "",
    dynamicStyle: DynamicStyle<StyleType> = {},
    animatedStyles?: AnimatedDynamicStyle<StyleType>[],
    componentNameAsId = false,
): DefaultProps<StyleType> & PropsType {

    const { eventHandlers: dynamicStyleEventHandlers, currentStyles } = useDynamicStyle<StyleType>(dynamicStyle, animatedStyles);

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

        if (!dynamicStyle)
            return {};

        const eventHandlers: object = {};

        Object.keys(dynamicStyleEventHandlers)
            .forEach(eventHandlerName => {
                // only reassign if dynamicstyle event handler is present
                if (dynamicStyle[eventHandlerName])
                    eventHandlers[eventHandlerName] = (event) => {
                        dynamicStyleEventHandlers[eventHandlerName]();

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
        style: {...currentStyles, ...props.style as object},
    };
}
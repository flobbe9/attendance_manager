import HelperProps from "@/abstract/HelperProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useEffect } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import HelperView from "@/components/helpers/HelperView";
import { logWarn } from "@/utils/logUtils";
import { useHelperProps } from "@/hooks/useHelperProps";


interface Props extends HelperProps<TextStyle>, TextProps {

}


/**
 * Wont render children. Does not support animated styles.
 * 
 * @since 0.0.1
 */
export default function Br({...props}: Props) {

    const componentName = "Br";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        if (children)
            logWarn("'<Br>' component wont render 'props.children'");
        
    }, []);

    return <Text {...otherProps}>{"\n"}</Text>;
}
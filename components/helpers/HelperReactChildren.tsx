import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { Fragment, ReactNode, useEffect } from "react";
import { TextProps, TextStyle } from "react-native";
import HelperText from "./HelperText";


interface Props extends HelperProps<TextStyle>, TextProps {
    children: ReactNode
}


/**
 * Wrap `ReactNode` children into this component to make sure that they are rendered correctly in both cases (typeof `string` and typeof `JSX.Element`).
 * 
 * @since latest
 */
export default function HelperReactChildren({rendered = true, onRender,...props}: Props) {

    const componentName = "HelperReactChildren";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    useEffect(() => {
        if (rendered && onRender)
            onRender();
    }, []);


    if (!rendered)
        return <Fragment />;
    

    return typeof children === "string" ? <HelperText {...otherProps}>{children}</HelperText> : children;
}
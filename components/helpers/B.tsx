import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Fragment, Ref } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import HelperText from "./HelperText";


interface Props extends HelperProps<TextStyle>, TextProps {}


/**
 * ```<HelperText>``` with bold style. 
 * 
 * @see HelperText
 * @since 0.0.1
 */
export default forwardRef(function B({...props}: Props, ref: Ref<Text>) {

    const componentName = "B";
    const { style, ...otherProps} = useHelperProps(props, componentName);

    return (
        <Fragment>
            <HelperText 
                ref={ref} 
                style={{
                    fontWeight: "bold",
                    ...style as TextStyle
                }} 
                {...otherProps} 
            />
        </Fragment>
    )
})
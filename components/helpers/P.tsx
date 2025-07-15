import HelperProps from "@/abstract/HelperProps";
import React, { forwardRef, Fragment, Ref } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import Br from "./Br";
import HelperText from "./HelperText";
import { useHelperProps } from "@/hooks/useHelperProps";


interface Props extends HelperProps<TextStyle>, TextProps {}


/**
 * ```<HelperText>``` followed by a ```<Br>```. Does not apply margin like the html ```<p>```. Supports animated text styles
 * 
 * @see HelperText
 * @since 0.0.1
 */
export default forwardRef(function P({...props}: Props, ref: Ref<Text>) {
    
    const componentName = "P";
    const { ...otherProps} = useHelperProps(props, componentName);

    return (
        <Fragment>
            <HelperText ref={ref} {...otherProps} />
            <Br />
        </Fragment>
    )
})
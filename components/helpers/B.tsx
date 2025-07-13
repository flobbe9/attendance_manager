import HelperProps from "@/abstract/HelperProps";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { forwardRef, Ref } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import HelperText from "./HelperText";
import { BOLD } from "@/utils/styleConstants";


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
        <HelperText 
            ref={ref} 
            style={{
                fontWeight: BOLD,
                ...style as TextStyle
            }} 
            {...otherProps} 
        />
    )
})
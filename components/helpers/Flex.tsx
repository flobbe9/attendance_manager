import React, { forwardRef, Ref } from "react";
import { FlexAlignContent, FlexDirection, FlexJustifyContent, FlexWrap, TextAlign } from "../../abstract/CSSTypes";
import HelperProps from "../../abstract/HelperProps";
import HelperView from "./HelperView";
import { FlexAlignType, View, ViewProps, ViewStyle } from "react-native";
import { isBlank } from "@/utils/utils";


interface Props extends HelperProps<ViewStyle>, ViewProps {

    /** Wont be set at all if ```undefined``` */
    horizontalAlign?: FlexJustifyContent,
    /** Wont be set at all if ```undefined``` */
    verticalAlign?: FlexAlignType,
    /** If true, dont set display to "flex". Default is false. */
    disableFlex?: boolean,
    /** Default is "row". See {@link FlexDirection} */
    flexDirection?: FlexDirection,
    /** Default is "wrap". See {@link FlexWrap} */
    flexWrap?: FlexWrap,
}


/**
 * Component that is basically a div with ```display: "flex"``` using the ```horizontalAlign``` prop for
 * ```justify-content``` and the ```verticalAlign``` prop for ```align-items```. 
 * 
 * @since 0.0.1
 */
export default forwardRef(function(
    {
        horizontalAlign, 
        verticalAlign,
        disableFlex = false,
        flexDirection = "row",
        flexWrap = "wrap",
        rendered = true,
        style,
        ...props
    }: Props,
    ref: Ref<View>
) {

    function parseAlignContent(): FlexAlignContent | undefined {

        if (isBlank(verticalAlign) || verticalAlign === "baseline")
            return;

        return verticalAlign;
    }

    return (
        <HelperView
            style={{
                alignItems: verticalAlign,
                alignContent: parseAlignContent(),
                display: "flex",
                flexDirection: flexDirection,
                flexWrap: flexWrap,
                justifyContent: horizontalAlign,
                ...style as object
            }}
            ref={ref}
            {...props}
        >
            {props.children}
        </HelperView>
    )
})
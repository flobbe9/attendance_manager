import React, { forwardRef, Ref } from "react";
import { FlexAlignContent, FlexDirection, FlexJustifyContent, FlexWrap, TextAlign } from "../../abstract/CSSTypes";
import HelperProps from "../../abstract/HelperProps";
import HelperView from "./HelperView";
import { FlexAlignType, View, ViewProps, ViewStyle } from "react-native";
import { isBlank } from "@/utils/utils";


interface Props extends HelperProps<ViewStyle>, ViewProps {

    /** Wont be set at all if ```undefined``` */
    justifyContent?: FlexJustifyContent,
    /** Wont be set at all if ```undefined``` */
    alignItems?: FlexAlignType,
    /** If true, dont set display to "flex". Default is false. */
    disableFlex?: boolean,
    /** Default is "row". See {@link FlexDirection} */
    flexDirection?: FlexDirection,
    /** Default is "wrap". See {@link FlexWrap} */
    flexWrap?: FlexWrap,
    /** Default is 0 */
    flexShrink?: number
}


/**
 * Component with ```flexDirection: "row"```. In react-native, flex is not done with ```display``` but with ```flexDirection```.
 * 
 * @since 0.0.1
 */
export default forwardRef(function(
    {
        justifyContent, 
        alignItems,
        disableFlex = false,
        flexDirection = "row",
        flexWrap = "wrap",
        flexShrink = 0,
        style,
        ...props
    }: Props,
    ref: Ref<View>
) {

    function parseAlignContent(): FlexAlignContent | undefined {

        if (isBlank(alignItems) || alignItems === "baseline")
            return;

        return alignItems;
    }

    return (
        <HelperView
            style={{
                alignItems: alignItems,
                alignContent: parseAlignContent(),
                flexDirection: disableFlex ? "column" : flexDirection,
                flexWrap: flexWrap,
                flexShrink: flexShrink,
                justifyContent: justifyContent,
                ...style as object
            }}
            ref={ref}
            {...props}
        >
            {props.children}
        </HelperView>
    )
})
import HelperProps from "@/abstract/HelperProps";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React, { ReactNode, useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Flex from "./helpers/Flex";
import HelperReactChildren from "./helpers/HelperReactChildren";
import { GlobalContext } from "./context/GlobalContextProvider";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    leftContent?: ReactNode;
    centerContent?: ReactNode;
    rightContent?: ReactNode;
}

/**
 * Customized screen header. By default devided into left, center right.
 *
 * @since 0.2.5
 */
export default function CustomScreenHeader({ leftContent, centerContent, rightContent, ...props }: Props) {
    const { prs } = useContext(GlobalContext);

    const componentName = "CustomScreenHeader";
    const { children, style, ...otherProps } = useHelperProps(props, componentName);

    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            flexWrap="nowrap"
            style={{ backgroundColor: "white", ...(style as object) }}
            {...otherProps}
        >
            <HelperView style={{ ...prs("col_2") }}>
                <HelperReactChildren>{leftContent}</HelperReactChildren>
            </HelperView>

            <HelperView style={{ ...prs("col_8") }}>
                <HelperReactChildren>{centerContent}</HelperReactChildren>
            </HelperView>

            <HelperView style={{ ...prs("col_2") }}>
                <HelperReactChildren>{rightContent}</HelperReactChildren>
            </HelperView>
        </Flex>
    );
}

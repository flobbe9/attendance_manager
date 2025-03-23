import HelperProps from "@/abstract/HelperProps";
import "@/assets/styles/AttendanceStyles.ts";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React from "react";
import { Modal, ViewProps, ViewStyle } from "react-native";
import HelperView from "@/components/helpers/HelperView";
import P from "@/components/helpers/P";
import { SafeAreaView } from "react-native-safe-area-context";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function index({...props}: Props) {

    const componentName = "index";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    return (
        <SafeAreaView>
            <HelperView {...otherProps}>
                <P>Ub details</P>

                <P>Inputs here</P>
                
                {children}
            </HelperView>
        </SafeAreaView>
    )
}
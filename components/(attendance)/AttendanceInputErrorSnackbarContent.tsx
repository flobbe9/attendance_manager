import HelperProps from "@/abstract/HelperProps";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FONT_SIZE_SMALLER } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import B from "../helpers/B";
import Br from "../helpers/Br";
import Flex from "../helpers/Flex";
import HelperText from "../helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    reason: string,
    invalidValue: string | number
}


/**
 * The content of the snackbar when an attendance input value is invalid.
 * 
 * @since 0.0.1
 */
export default function AttendanceInputErrorSnackbarContent({reason, invalidValue, ...props}: Props) {

    const componentName = "AttendanceInputErrorSnackbarContent";
    const { children, ...otherProps } = useHelperProps(props, componentName);
    
    const { allStyles: { me_2 } } = useResponsiveStyles();
    
    return (
        <HelperView {...otherProps}>
            <Flex flexWrap="nowrap" alignItems="center">
                <HelperView style={{...me_2}}>
                    <FontAwesome name="info-circle" size={FONT_SIZE_SMALLER} />
                </HelperView>

                <B>
                    '{invalidValue}' kann nicht ausgewählt werden
                </B>
            </Flex>

            <Br />

            <HelperText>
                {reason}
            </HelperText>

            <HelperText>
                Um alle erlaubten Werte anzuzeigen, tippe auf die Glühbirne neben der Feldüberschrift. 
            </HelperText>

            {children}
        </HelperView>
    )
}
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ViewProps, ViewStyle } from "react-native";
import HelperView from "@/components/helpers/HelperView";
import DefaultProps from "@/abstract/DefaultProps";
import { SafeAreaProvider } from "react-native-safe-area-context";


interface Props extends DefaultProps<ViewStyle>, ViewProps {

}


/**
 * Wrap any index component representing a whole screen inside this. Makes sure that screen height etc is
 * handles correctly accross all devices.
 * 
 * @since 0.0.1
 */
export default function ScreenWrapper({...props}: Props) {

    const componentName = "ScreenWrapper";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'} {...otherProps}>
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
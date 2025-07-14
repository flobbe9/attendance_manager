import DefaultProps from "@/abstract/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useContext } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ViewProps, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalContext } from "../context/GlobalContextProvider";


interface Props extends DefaultProps<ViewStyle>, ViewProps {
    contentContainerStyle?: ViewStyle
}


/**
 * Wrap any index component representing a whole screen inside this. Makes sure that screen height etc is
 * handles correctly accross all devices.
 * 
 * Avoid nesting these.
 * 
 * Will update `globalScreenTouch` state on touchstart.
 * 
 * @since 0.0.1
 */
export default function ScreenWrapper({...props}: Props) {

    const { globalScreenTouch, setGlobalScreenTouch } = useContext(GlobalContext);

    const componentName = "ScreenWrapper";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    function handleTouchStart(_event): void {
        setGlobalScreenTouch(!globalScreenTouch);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'position'} 
                    onTouchStart={handleTouchStart}
                    {...otherProps}
                >
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
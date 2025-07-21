import DefaultProps from "@/abstract/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";
import React, { useContext } from "react";
import { KeyboardAvoidingView, SafeAreaView, ViewProps, ViewStyle } from "react-native";
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
    const { globalScreenTouch, setGlobalScreenTouch, isKeyBoardvisible } = useContext(GlobalContext);

    const componentName = "ScreenWrapper";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName);

    const hasMounted = useHasComponentMounted();

    function handleTouchStart(_event): void {
        if (!hasMounted)
            return;
        
        setGlobalScreenTouch(!globalScreenTouch);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAvoidingView
                    behavior={'position'} 
                    style={{
                        paddingBottom: isKeyBoardvisible ? 130 : 0, // bottom offset for keyboard not to cover content
                        ...style as object,
                    }}
                    onTouchStart={handleTouchStart}
                    {...otherProps}
                >
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
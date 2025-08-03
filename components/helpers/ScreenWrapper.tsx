import DefaultProps from "@/abstract/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ViewProps, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Props extends DefaultProps<ViewStyle>, ViewProps {
    contentContainerStyle?: ViewStyle;
}

/**
 * Wrap any index component representing a whole screen inside this. Makes sure that screen height etc is
 * handles correctly accross all devices.
 *
 * Avoid nesting these.
 *
 * @since 0.0.1
 */
export default function ScreenWrapper({ ...props }: Props) {
    const componentName = "ScreenWrapper";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName);

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAvoidingView
                    behavior={"position"}
                    enabled={Platform.OS === "ios"}
                    style={{
                        // NOTE: keep this until tested on ios, works without on android
                        // paddingBottom: isKeyBoardvisible ? 130 : 0, // bottom offset for keyboard not to cover content
                        ...(style as object),
                    }}
                    {...otherProps}
                >
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

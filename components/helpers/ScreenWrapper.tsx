import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useContext, useEffect } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ViewProps, ViewStyle } from "react-native";
import HelperView from "@/components/helpers/HelperView";
import DefaultProps from "@/abstract/DefaultProps";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalContext } from "../context/GlobalContextProvider";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";


interface Props extends DefaultProps<ViewStyle>, ViewProps {
    contentContainerStyle?: ViewStyle
}


/**
 * Wrap any index component representing a whole screen inside this. Makes sure that screen height etc is
 * handles correctly accross all devices.
 * 
 * Avoid nesting these.
 * 
 * Will update `globalBlur` state on touchstart. Will hide `<Popup>` on blur
 * 
 * @since 0.0.1
 */
export default function ScreenWrapper({...props}: Props) {

    const { globalBlur, setGlobalBlur, globalPopupProps, hideGlobalPopup } = useContext(GlobalContext);

    const componentName = "ScreenWrapper";
    const { children, ...otherProps } = useDefaultProps(props, componentName);
    const hasMounted = useHasComponentMounted();


    useEffect(() => {
        if (!hasMounted)
            return;

        hideGlobalPopup(globalPopupProps);

    }, [globalBlur])


    function handleTouchStart(_event): void {

        setGlobalBlur(!globalBlur);
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
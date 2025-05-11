import DefaultProps from "@/abstract/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import React, { useContext, useEffect } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { GlobalContext } from "./context/GlobalContextProvider";
import CustomSnackbar from "./helpers/CustomSnackbar";
import ScreenWrapper from "./helpers/ScreenWrapper";
import { log } from "@/utils/logUtils";
import Popup from "./helpers/Popup";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";


interface Props extends DefaultProps<ViewStyle>, ViewProps {

}


/**
 * Wrap index screen components into this. Provides global popups and wraps children in `<ScreenWrapper>`.
 * 
 * Avoid nesting these.
 * 
 * @since 0.0.1
 */
export default function ScreenProvider({...props}: Props) {

    const { globalSnackbarProps, globalPopupProps, hideGlobalPopup, globalBlur } = useContext(GlobalContext); // get globalpopup props

    const componentName = "ScreenProvider";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    const hasMounted = useHasComponentMounted();


    useEffect(() => {
        if (!hasMounted)
            return;

        hideGlobalPopup(globalPopupProps);

    }, [globalBlur])


    return (
        <ScreenWrapper {...otherProps}>
            {children}

            <CustomSnackbar {...globalSnackbarProps} />

            <Popup {...globalPopupProps} />
        </ScreenWrapper>
    )
}
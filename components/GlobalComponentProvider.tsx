import React, { useContext } from "react";
import { Provider } from "react-native-paper";
import { GlobalContext } from "./context/GlobalContextProvider";
import CustomSnackbar from "./CustomSnackbar";
import Popup from "@/components/Popup";
import Toast from "./Toast";



/**
 * Provides global popups etc. Should be wrapped around all screens automatically by only adding it to the app _layout
 * 
 * @since 0.0.1
 */
export default function GlobalComponentProvider({children}) {

    const { globalSnackbarProps, globalPopupProps, globalToastProps, hideToast } = useContext(GlobalContext);


    return (
        <Provider> {/** for react-native-paper */}
            {children}

            <Toast hideToast={hideToast} {...globalToastProps} />

            <CustomSnackbar {...globalSnackbarProps} />

            <Popup {...globalPopupProps} />
        </Provider>
    )
}
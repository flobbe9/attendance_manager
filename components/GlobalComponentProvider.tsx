import Popup from "@/components/Popup";
import React, { ReactNode, useContext } from "react";
import { useClickOutside } from "react-native-click-outside";
import { Provider } from "react-native-paper";
import { GlobalContext } from "./context/GlobalContextProvider";
import CustomSnackbar from "./CustomSnackbar";
import Toast from "./Toast";

/**
 * Provides global popups etc. Should be wrapped around all screens automatically by only adding it to the app _layout
 *
 * Will hide `<Popup>` on blur
 *
 * @since 0.0.1
 */
export default function GlobalComponentProvider({ children }: { children: ReactNode }) {
    const {
        globalSnackbarProps,
        globalPopupProps,
        hideGlobalPopup,

        globalToastProps,
        hideToast,
    } = useContext(GlobalContext);

    const popupRef = useClickOutside(() => hideGlobalPopup(globalPopupProps));

    return (
        /** for react-native-paper */
        <Provider>
            {children}

            <Toast hideToast={hideToast} {...globalToastProps} />

            <CustomSnackbar {...globalSnackbarProps} />

            <Popup ref={popupRef} {...globalPopupProps} />
        </Provider>
    );
}

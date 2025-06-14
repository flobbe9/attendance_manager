import Popup from "@/components/Popup";
import React, { Fragment, ReactNode, useContext } from "react";
import { Provider } from "react-native-paper";
import { GlobalContext } from "./context/GlobalContextProvider";
import CustomSnackbar from "./CustomSnackbar";
import Toast from "./Toast";
import { useScreenTouch } from "@/hooks/useScreenTouch";



/**
 * Provides global popups etc. Should be wrapped around all screens automatically by only adding it to the app _layout
 * 
 * Will update `globalScreenTouch` state on touchstart. Will hide `<Popup>` on blur
 * 
 * @since 0.0.1
 */
export default function GlobalComponentProvider({children}: {children: ReactNode}) {

    const { 
        globalSnackbarProps, 
        globalPopupProps,
        hideGlobalPopup, 

        globalToastProps, 
        hideToast,

        globalScreenTouch,
        setGlobalScreenTouch,
    } = useContext(GlobalContext);


    function handleTouchStart(_event): void {
        
        setGlobalScreenTouch(!globalScreenTouch);
    }

    
    useScreenTouch(() => {
        
        hideGlobalPopup(globalPopupProps);
    });
    
    
    return (
        /** for react-native-paper */
        <Provider> 
            {children}

            <Toast hideToast={hideToast} onTouchStart={handleTouchStart} {...globalToastProps} />

            <CustomSnackbar onTouchStart={handleTouchStart} {...globalSnackbarProps} />

            <Popup onTouchStart={handleTouchStart} {...globalPopupProps} />
        </Provider>
    )
}
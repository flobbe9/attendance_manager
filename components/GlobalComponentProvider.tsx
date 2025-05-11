import React, { useContext } from "react";
import { Provider } from "react-native-paper";
import { GlobalContext } from "./context/GlobalContextProvider";
import CustomSnackbar from "./helpers/CustomSnackbar";
import Popup from "./helpers/Popup";



/**
 * Provides global popups etc.
 * 
 * @since 0.0.1
 */
export default function GlobalComponentProvider({children}) {

    const { globalSnackbarProps, globalPopupProps } = useContext(GlobalContext);


    return (
        <Provider> {/** for react-native-paper */}
            {children}

            <CustomSnackbar {...globalSnackbarProps} />

            <Popup {...globalPopupProps} />
        </Provider>
    )
}
import { createContext, ReactNode, useEffect, useState } from "react";
import { SnackbarProps } from "react-native-paper";
import { de, en, registerTranslation } from 'react-native-paper-dates';
import { CustomnSnackbarProps, CustomSnackbarStatus } from "../helpers/CustomSnackbar";
import { GlobalPopupProps } from "../helpers/Popup";
import { isNumberFalsy } from "@/utils/utils";
import { log } from "@/utils/logUtils";


/**
 * Contains global variables accessible in the whole app.
 * 
 * @param param0 only accepts children as props
 * @since 0.0.1
 */
export default function GlobalContextProvider({children}: {children: ReactNode}) {
    
    /** Toggle state, meaning the boolean value does not represent any information but is just to be listened to with `useEffect` */
    const [globalBlur, setGlobalBlur] = useState(false);

    const [globalSnackbarProps, setGlobalSnackbarProps] = useState<CustomnSnackbarProps>({
        status: "info",
        visible: false,
        onDismiss: () => {},
        children: ""
    });

    const [globalPopupProps, setGlobalPopupProps] = useState<GlobalPopupProps>({message: "", visible: false})
    const [globalPopupTimeout, setGlobalPopupTimeout] = useState<NodeJS.Timeout>();

    const context = {
        globalBlur, setGlobalBlur,

        snackbar,
        globalSnackbarProps, setGlobalSnackbarProps,

        popup,
        hideGlobalPopup,
        globalPopupProps, setGlobalPopupProps
    }


    useEffect(() => {
        initReactPaperLocales();

    }, []);


    /**
     * Show snackbar at bottom of screen.
     * 
     * @param message the snackbar children
     * @param status will affect the container style
     * @param options see {@link SnackbarProps}
     * @param onDismiss called once snackbar is hidden and after action press. Will hide snackbar regardless of this param's value
     */
    function snackbar(
        message: React.ReactNode,
        status: CustomSnackbarStatus = "info",
        options: Omit<SnackbarProps, "children" | "visible" | "onDismiss"> = {},
        onDismiss?: () => void
    ): void {

        // make sure dismiss always hides snackbar
        const onDismissWithHide = () => {
            if (onDismiss)
                onDismiss();

            hideSnackbar();
        }

        const snackbarProps: SnackbarProps = {
            visible: true,
            children: message,
            onDismiss: onDismissWithHide,
            ...options
        }

        setGlobalSnackbarProps({
            ...snackbarProps,
            status
        });
    }


    function hideSnackbar(): void {

        setGlobalSnackbarProps({...globalSnackbarProps, visible: false});
    }


    /**
     * Display a subtle `<Popup>` and hide automatically. 
     * 
     * @param message rendered as children
     * @param options see {@link GlobalPopupProps}
     */
    function popup(message: ReactNode, options: Omit<GlobalPopupProps, "visible" | "message"> = {}): void {

        const popupProps: GlobalPopupProps = {
            visible: true,
            message,
            ...options,
        };

        if (globalPopupTimeout)
            clearTimeout(globalPopupTimeout);

        setTimeout(() => {
            setGlobalPopupProps(popupProps);
        }, 0); // somhow causes popup call to be after blur hidePopup call

        setGlobalPopupTimeout(setTimeout(() => hideGlobalPopup(popupProps), options.duration ?? 5000));
    }


    function hideGlobalPopup(globalPopupProps: GlobalPopupProps): void {

        setGlobalPopupProps({...globalPopupProps, visible: false});
    }


    function initReactPaperLocales() {
        
        // https://web-ridge.github.io/react-native-paper-dates/docs/intro/        
        registerTranslation('de', de);
        registerTranslation('en', en);
    }


    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    )
}


export const GlobalContext = createContext({
    globalBlur: false, 
    setGlobalBlur: (_globalBlur: boolean) => {},

    snackbar: (message: React.ReactNode, status: CustomSnackbarStatus = "info", options?: Omit<SnackbarProps, "children" | "visible" | "onDismiss">, onDismiss?: () => void) => {},
    globalSnackbarProps: {} as CustomnSnackbarProps, 
    setGlobalSnackbarProps: (props: CustomnSnackbarProps) => {},

    popup: (message: ReactNode, options: Omit<GlobalPopupProps, "visible" | "message"> = {}) => {},
    hideGlobalPopup: (globalPopupProps: GlobalPopupProps) => {},
    globalPopupProps: {} as GlobalPopupProps,
    setGlobalPopupProps: (props: GlobalPopupProps) => {}
})
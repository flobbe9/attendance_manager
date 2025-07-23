import {GlobalPopupProps} from "@/components/Popup";
import {logWarn} from "@/utils/logUtils";
import {isFalsy} from "@/utils/utils";
import {createContext, ReactNode, useEffect, useState} from "react";
import {SnackbarProps} from "react-native-paper";
import {de, en, registerTranslation} from "react-native-paper-dates";
import {CustomnSnackbarProps, CustomSnackbarStatus} from "../CustomSnackbar";
import {GlobalToastProps} from "../Toast";
import {Keyboard} from "react-native";

/**
 * Contains global variables accessible in the whole app.
 *
 * @param param0 only accepts children as props
 * @since 0.0.1
 */
export default function GlobalContextProvider({children}: {children: ReactNode}) {
    /** Toggle state, meaning the boolean value does not represent any information but is just to be listened to with `useEffect` */
    const [globalScreenTouch, setGlobalScreenTouch] = useState(false);
    const [isKeyBoardvisible, setKeyboardVisible] = useState(false);

    const [globalSnackbarProps, setGlobalSnackbarProps] = useState<CustomnSnackbarProps>({
        status: "info",
        visible: false,
        onDismiss: () => {},
        children: "",
    });

    const [globalPopupProps, setGlobalPopupProps] = useState<GlobalPopupProps>({message: "", visible: false});
    const [globalPopupTimeout, setGlobalPopupTimeout] = useState<number>();

    const [globalToastProps, setGlobalToastProps] = useState<GlobalToastProps>({
        visible: false,
        content: "",
    });

    const context = {
        globalScreenTouch,
        setGlobalScreenTouch,

        isKeyBoardvisible,
        setKeyboardVisible,

        snackbar,
        hideSnackbar,
        globalSnackbarProps,

        popup,
        hideGlobalPopup,
        globalPopupProps,

        toast,
        hideToast,
        globalToastProps,
    };

    useEffect(() => {
        initReactPaperLocales();
        subscribeKeyboardListeners();

        return () => {
            unsubscribeKeyboardListeners();
        };
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
            if (onDismiss) onDismiss();

            hideSnackbar();
        };

        const snackbarProps: SnackbarProps = {
            visible: true,
            children: message,
            onDismiss: onDismissWithHide,
            ...options,
        };

        setGlobalSnackbarProps({
            ...snackbarProps,
            status,
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

        if (globalPopupTimeout) clearTimeout(globalPopupTimeout);

        setTimeout(() => {
            setGlobalPopupProps(popupProps);
        }, 0); // somhow causes popup call to be after blur hidePopup call

        setGlobalPopupTimeout(setTimeout(() => hideGlobalPopup(popupProps), options.duration ?? 5000));
    }

    function hideGlobalPopup(globalPopupProps: GlobalPopupProps): void {
        setGlobalPopupProps({...globalPopupProps, visible: false});
    }

    /**
     * Show toast popup and update `globalToastProps`. Always combine `toastProps` with `globalToastProps` for fallback values.
     *
     * @param content of toast, optionally including a custom footer. Set `toastProps.defaultFooter` to `false` for that
     * @param toastProps
     */
    function toast(content: ReactNode, toastProps: Omit<GlobalToastProps, "content" | "visible"> = {}): void {
        if (isFalsy(content)) {
            logWarn("Not toasting without content. Please specifiy toast 'content'");
            return;
        }

        setGlobalToastProps({
            ...globalToastProps,
            ...toastProps,
            visible: true,
            content,
        });
    }

    function hideToast(): void {
        setGlobalToastProps({
            ...globalToastProps,
            visible: false,
        });
    }

    function initReactPaperLocales(): void {
        // https://web-ridge.github.io/react-native-paper-dates/docs/intro/
        registerTranslation("de", de);
        registerTranslation("en", en);
    }

    function subscribeKeyboardListeners(): void {
        Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    }

    function unsubscribeKeyboardListeners(): void {
        Keyboard.removeAllListeners("keyboardDidShow");
        Keyboard.removeAllListeners("keyboardDidHide");
    }

    return <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>;
}

export const GlobalContext = createContext({
    globalScreenTouch: false,
    setGlobalScreenTouch: (_globalBlur: boolean) => {},

    isKeyBoardvisible: false,
    setKeyboardVisible: (isVisible: boolean): void => {},

    snackbar: (
        message: React.ReactNode,
        status: CustomSnackbarStatus = "info",
        options?: Omit<SnackbarProps, "children" | "visible" | "onDismiss">,
        onDismiss?: () => void
    ) => {},
    globalSnackbarProps: {} as CustomnSnackbarProps,
    hideSnackbar: (): void => {},

    popup: (message: ReactNode, options: Omit<GlobalPopupProps, "visible" | "message"> = {}) => {},
    hideGlobalPopup: (globalPopupProps: GlobalPopupProps) => {},
    globalPopupProps: {} as GlobalPopupProps,

    toast: (content: ReactNode, globalToastProps: Omit<GlobalToastProps, "content" | "visible"> = {}): void => {},
    hideToast: (): void => {},
    globalToastProps: {} as GlobalToastProps,
});

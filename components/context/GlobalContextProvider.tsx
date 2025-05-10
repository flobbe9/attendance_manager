import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { createContext, ReactNode, useEffect, useState } from "react";
import { StyleProp, ViewStyle, TextStyle } from "react-native";
import { de, en, registerTranslation } from 'react-native-paper-dates';


/**
 * Contains global variables accessible in the whole app.
 * 
 * @param param0 only accepts children as props
 * @since 0.0.1
 */
export default function GlobalContextProvider({children}: {children: ReactNode}) {
    
    /** Toggle state, meaning the boolean value does not represent any information but is just to be listened to with `useEffect` */
    const [globalBlur, setGlobalBlur] = useState(false);

    const context = {
        globalBlur, setGlobalBlur
    }


    useEffect(() => {
        initReactPaperLocales();
    }, []);

    
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
    setGlobalBlur: (_globalBlur: boolean) => {}
})
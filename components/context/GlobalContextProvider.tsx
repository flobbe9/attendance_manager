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
    
    const [errorMessage, setErrorMessage] = useState(""); 

    const responsiveStyles = useResponsiveStyles();
    
    const context = {
        errorMessage,
        setErrorMessage,
        responsiveStyles
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
    errorMessage: "",
    setErrorMessage: (errorMessage: string) => {},
    responsiveStyles: {} as Record<any, StyleProp<ViewStyle & TextStyle>>
})
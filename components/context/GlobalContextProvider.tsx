import { createContext, ReactNode, useEffect, useState } from "react";
import { de, en, registerTranslation } from 'react-native-paper-dates'

/**
 * Contains global variables accessible in the whole app.
 * 
 * @param param0 only accepts children as props
 * @since 0.0.1
 */
export default function GlobalContextProvider({children}: {children: ReactNode}) {
    
    const [errorMessage, setErrorMessage] = useState("");
    
    const context = {
        errorMessage,
        setErrorMessage
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
        <IndexContext.Provider value={context}>
            {children}
        </IndexContext.Provider>
    )
}


export const IndexContext = createContext({
    errorMessage: "",
    setErrorMessage: (errorMessage: string) => {}
})
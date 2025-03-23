import { createContext, ReactNode, useState } from "react";



export default function IndexContextProvider({children}: {children: ReactNode}) {

    const [errorMessage, setErrorMessage] = useState("");

    const context = {
        errorMessage,
        setErrorMessage
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
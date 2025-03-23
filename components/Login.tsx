import { useDynamicStyles } from "@/hooks/useDynamicStyles";
import { useContext, useRef, useState } from "react";
import { Modal, NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextInputProps, View, Text } from "react-native";
import { LoginEmailInputStyles } from './../assets/styles/LoginStyles';
import { IndexContext } from "./context/IndexContextProvider";
import HelperView from "./helpers/HelperView";
import { useDefaultProps } from "@/hooks/useDefaultProps";


export default function Login(props) {

    const { errorMessage, setErrorMessage } = useContext(IndexContext);

    const componentName = "Login";
    const { children, ...otherProps } = useDefaultProps(props, componentName);

    return (
        <HelperView {...otherProps}>
            <Text>Index</Text>

            {children}
        </HelperView>
    )
}
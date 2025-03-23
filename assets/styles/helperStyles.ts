/**
 * Contains generic helper styles which may be used for any component. An exported constant
 * should be of type ```DynamicStyles``` or a react-native style type like ```ViewStyle```.
 * 
 * @since 0.0.1
 */

import { TextStyle, ViewStyle } from "react-native";


type StyleType = ViewStyle & TextStyle;


export class HelperStyles {
    static disabled: StyleType = { opacity: 0.5 };
    /** Css equivalent: ```width: "fit-content"``` */
    static fitContent: StyleType = { alignSelf: 'flex-start' };
    static flex: ViewStyle = { display: "flex" };
    static flexCenter: ViewStyle = { 
        ...this.flex,
        justifyContent: "center", 
        alignContent: "center" 
    };
}
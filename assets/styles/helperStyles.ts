/**
 * Contains generic helper styles which may be used for any component. An exported constant
 * should be of type ```DynamicStyle``` or a react-native style type like ```ViewStyle```.
 * 
 * @since 0.0.1
 */

import { TextStyle, ViewStyle } from "react-native";


type StyleType = ViewStyle & TextStyle;


export default class HelperStyles {
    static disabled: StyleType = { 
        opacity: 0.5
    };

    /** Css equivalent: ```width: "fit-content"``` */
    static fitContent: StyleType = { 
        alignSelf: 'flex-start' 
    };

    static flex: StyleType = { 
        display: "flex", 
        flexDirection: "row",
        flexWrap: "wrap"
    };

    static flexCenter: StyleType = { 
        ...this.flex,
        justifyContent: "center", 
    };

    /** Center horizontally without putting elements next to eachother */
    static centerNoFlex: StyleType = {
        ...this.flex,
        flexDirection: "column", 
        alignItems: "center"
    }

    static flexCenterCenter: StyleType = { 
        ...this.flex,
        justifyContent: "center", 
        alignItems: "center",
        alignContent: "center"  // this is needed in combination with alignSelf: 'flex-start'
    };

    static flexStart: StyleType = { 
        ...this.flex,
        justifyContent: "flex-start", 
    };

    static flexStartStart: StyleType = { 
        ...this.flex,
        alignItems: "flex-start", 
        justifyContent: "flex-start",
    };

    static fullWidth: StyleType = {
        width: "100%",
    }
    
    static fullHeight: StyleType = {
        height: "100%",
    }
}
import { DynamicStyles } from "@/abstract/DynamicStyles";
import { ViewStyle } from "react-native";


type StyleType = ViewStyle;


export class AttendanceIndexStyles {
    static component: DynamicStyles<StyleType> = {
        default: {
            padding: 10
        }
    }

    static link: DynamicStyles<StyleType> = {
        default: {
            marginBottom: 10
        }
    }

    // TODO: 
        // button ripple border radius
        // helper button should just pass dynamic styls to helperview?
        // remove helperprops in most other components
    static addButton: DynamicStyles<StyleType> = {
        default: {
            backgroundColor: "gray",
            borderRadius: "100%",
            bottom: 10,
            // position: "fixed",
            padding: 20,
            right: 10,
        },
        touchStart: {
            backgroundColor: "blue"
        }
    }
}
import { DeviceOrientation } from "@/abstract/DeviceOrientation";
import { useWindowDimensions } from "react-native";


/**
 * @return the current orientation of the device
 * @since 0.0.1
 */
export function useDeviceOrientation(): DeviceOrientation {

    const { width, height } = useWindowDimensions();
    
    return width > height ? "landscape" : "portrait";
}
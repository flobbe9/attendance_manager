import { useFonts } from "expo-font";
import { ReactNode } from "react";

/**
 * Load assets like fonts etc.. Should not render any components.
 * 
 * @since latest
 * @see https://docs.expo.dev/develop/user-interface/fonts/#with-usefonts-hook
 */
export default function AssetProvider({ children }: { children: ReactNode }) {
    // paths relative to this file
    useFonts({
        // "MozillaHeadline_Condensed-Regular": require("../../assets/fonts/MozillaHeadline_Condensed-Regular.ttf"),
        // "LibertinusSerif-Regular": require("../../assets/fonts/LibertinusSerif-Regular.ttf"),
    });

    return children;
}

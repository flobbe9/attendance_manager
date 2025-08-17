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
        "Lato": require("../../assets/fonts/Lato-Regular.ttf"),
    });

    return children;
}

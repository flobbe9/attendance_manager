import {
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_WEIGHT,
    FONT_FAMILY,
    FONT_FAMILY_BOLD,
    FONT_FAMILY_BOLD_ITALIC,
    FONT_FAMILY_ITALIC,
    FONT_WEIGHT_BOLD,
    LINE_HEIGHT,
} from "@/utils/styleConstants";
import { isNumberFalsy, stringToNumber } from "@/utils/utils";
import { useFonts } from "expo-font";
import { createContext, ReactNode } from "react";
import { TextStyle } from "react-native";

/**
 * Load assets like fonts etc.. Should not render any components.
 *
 * @since latest
 * @see https://docs.expo.dev/develop/user-interface/fonts/#with-usefonts-hook
 */
export default function AssetProvider({ children }: { children: ReactNode }) {
    // paths relative to this file
    useFonts({
        [FONT_FAMILY]: require("../../assets/fonts/Lato-Regular.ttf"),
        [FONT_FAMILY_ITALIC]: require("../../assets/fonts/Lato-Italic.ttf"),
        [FONT_FAMILY_BOLD]: require("../../assets/fonts/Lato-Bold.ttf"),
        [FONT_FAMILY_BOLD_ITALIC]: require("../../assets/fonts/Lato-BoldItalic.ttf"),
    });

    const context = {
        defaultFontStyles,
    };

    /**
     * @param style of the text component this is applied to. Not modified
     * @returns `style.lineHeight` or line height based on the font size. Handle invalid arg gracefully
     */
    function lineHeight(style: TextStyle): number {
        // dont use lato lineHeight if non-default font family is specified
        if (!style || (isNumberFalsy(style.lineHeight) && style.fontFamily && !style.fontFamily.startsWith(FONT_FAMILY))) return 1;

        return style.lineHeight ?? (style.fontSize ?? DEFAULT_FONT_SIZE) * LINE_HEIGHT;
    }

    /**
     * @param style of the text component this is applied to. Not modified
     * @returns `style.fontFamily` or font family depending on fontWeight and fontStyle. Handle invalid arg gracefully
     */
    function fontFamily(style: TextStyle): string {
        if (!style) return undefined;

        if (style.fontFamily && !style.fontFamily.startsWith(FONT_FAMILY)) return style.fontFamily;

        let isBold =
            style.fontWeight === "bold" ||
            style.fontWeight === "condensedBold" ||
            (stringToNumber(style.fontWeight) ?? DEFAULT_FONT_WEIGHT) >= FONT_WEIGHT_BOLD;

        let isItalic = style.fontStyle === "italic";

        if (isBold && isItalic) return FONT_FAMILY_BOLD_ITALIC;

        if (isBold) return FONT_FAMILY_BOLD;

        if (isItalic) return FONT_FAMILY_ITALIC;

        return FONT_FAMILY;
    }

    /**
     * @param style of the text component this is applied to. Not modified
     * @returns default font props considering fontWeight, fontFamily and fontStyle. Handle invalid arg gracefully
     */
    function defaultFontStyles(style: TextStyle): TextStyle {
        if (!style) return {};

        return {
            fontFamily: fontFamily(style),
            lineHeight: lineHeight(style),
        };
    }

    return <AssetContext.Provider value={context}>{children}</AssetContext.Provider>;
}

export const AssetContext = createContext({
    defaultFontStyles: (style: TextStyle): TextStyle => ({} as TextStyle),
});

import { PartialRecord } from "@/abstract/PartialRecord";
import { ResponsiveStyle } from "@/abstract/ResponsiveStyle";
import { logWarn } from "@/utils/logUtils";
import { LG_MIN_WIDTH, MD_MIN_WIDTH, SM_MIN_WIDTH } from "@/utils/styleConstants";
import { isBlank, isNumberFalsy, sortObjectByKeys } from "@/utils/utils";
import { useEffect, useState } from "react";
import { ImageStyle, TextStyle, useWindowDimensions, ViewStyle } from "react-native";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";

/**
 * Creates style objects that behave like css bootstrap classes.
 *
 * Example usage:
 * 
 * ```
 * const { prs } = useResponsiveStyles();
 * ...
 * <View style={prs("col_sm_10", "col_5")}>
 *  ...
 * ```
 * is the equivalent to bootstrap (v5): `col-5 col-sm-10`.
 * Notice that the order in which the styles are passed to the parsing function does not matter.
 * 
 * Ideally call this once only (global context e.g.) in order to improove performance.
 *
 * @returns bootstrap like style objects that get updated with screen width
 * @since 0.0.1
 */
export function useResponsiveStyles() {
    const { width } = useWindowDimensions();
    const [allStyles, setAllStyles] = useState<ResponsiveStyle>({});

    useEffect(() => {
        setAllStyles(getAllStyles());
    }, [width]);

    // NOTE: dont infer for prefixMapping to be validated strictly
    const stylePropPrefixObj = { m: "margin", p: "padding", col: "width" };
    type StylePropPrefix = keyof typeof stylePropPrefixObj;
    const stylePropOrientationObj = { "": "", x: 0, y: 0, t: "Top", e: "Right", b: "Bottom", s: "Left" };
    type StylePropOrientation = keyof typeof stylePropOrientationObj;
    // NOTE: keep this in order of priority (small to large)
    const stylePropScreenWidthObj = {
        "": true,
        _sm: !isNumberFalsy(width) && width >= SM_MIN_WIDTH,
        _md: !isNumberFalsy(width) && width >= MD_MIN_WIDTH,
        _lg: !isNumberFalsy(width) && width >= LG_MIN_WIDTH,
    };
    type StylePropScreenWidth = keyof typeof stylePropScreenWidthObj;
    const stylePropPixelQuantifierObj = { _0: 0, _1: 5, _2: 10, _3: 20, _4: 30, _5: 40, _6: 60, _7: 80, _8: 100, _9: 120, _10: 140 };
    type StylePropPixelQuantifier = keyof typeof stylePropPixelQuantifierObj;
    const stylePropWidthQuantifierObj = {
        _1: `${(1 / 12) * 100}%`,
        _2: `${(2 / 12) * 100}%`,
        _3: `${(3 / 12) * 100}%`,
        _4: `${(4 / 12) * 100}%`,
        _5: `${(5 / 12) * 100}%`,
        _6: `${(6 / 12) * 100}%`,
        _7: `${(7 / 12) * 100}%`,
        _8: `${(8 / 12) * 100}%`,
        _9: `${(9 / 12) * 100}%`,
        _10: `${(10 / 12) * 100}%`,
        _11: `${(11 / 12) * 100}%`,
        _12: `${(12 / 12) * 100}%`,
    };
    type StylePropWidthQuantifier = keyof typeof stylePropWidthQuantifierObj;

    type StylePropPrefixMapping = Record<
        keyof typeof stylePropPrefixObj,
        {
            orientation: PartialRecord<StylePropOrientation, string | number>;
            screenWidth: PartialRecord<StylePropScreenWidth, boolean>;
            quantifier: PartialRecord<StylePropPixelQuantifier | StylePropWidthQuantifier, string | number>;
        }
    >;
    const stylePropPrefixMapping: StylePropPrefixMapping = {
        m: {
            orientation: stylePropOrientationObj,
            screenWidth: stylePropScreenWidthObj,
            quantifier: stylePropPixelQuantifierObj,
        },
        p: {
            orientation: stylePropOrientationObj,
            screenWidth: stylePropScreenWidthObj,
            quantifier: stylePropPixelQuantifierObj,
        },
        col: {
            orientation: { "": stylePropOrientationObj[""] },
            screenWidth: stylePropScreenWidthObj,
            quantifier: stylePropWidthQuantifierObj,
        },
    };

    function getAllStyles(): ResponsiveStyle {
        const styleProps = {};

        (Object.entries(stylePropPrefixMapping) as [StylePropPrefix, StylePropPrefixMapping[keyof StylePropPrefixMapping]][]).forEach(
            ([stylePropPrefix, stylePropConfig]) =>
                (Object.keys(stylePropConfig.orientation) as StylePropOrientation[]).forEach((stylePropOrientation) =>
                    (Object.keys(stylePropConfig.screenWidth) as StylePropScreenWidth[]).forEach((stylePropScreenWidth) =>
                        (Object.keys(stylePropConfig.quantifier) as (StylePropPixelQuantifier | StylePropWidthQuantifier)[]).forEach(
                            (stylePropQuantifier) =>
                                (styleProps[`${stylePropPrefix}${stylePropOrientation}${stylePropScreenWidth}${stylePropQuantifier}`] =
                                    parseResponsiveStyleProps(stylePropQuantifier, stylePropOrientation, stylePropPrefix, stylePropScreenWidth))
                        )
                    )
                )
        );

        return styleProps;
    }

    /**
     * @returns a valid style object or and empty object depending on the current screen width. Never ```undefined```
     */
    function parseResponsiveStyleProps(
        stylePropQuantifier: StylePropPixelQuantifier | StylePropWidthQuantifier,
        stylePropOrientation: StylePropOrientation,
        stylePropPrefix: StylePropPrefix,
        stylePropScreenWidth: StylePropScreenWidth
    ): ValueOf<ResponsiveStyle> {
        const style: ValueOf<ResponsiveStyle> = {};

        // case: style is not for the current window width
        if (!stylePropScreenWidthObj[stylePropScreenWidth]) return style;

        // const styleValue = stylePropQuantifierObj[stylePropQuantifier];
        const styleValue = stylePropPrefixMapping[stylePropPrefix].quantifier[stylePropQuantifier];

        if (stylePropOrientation === "x") {
            style[`${stylePropPrefixObj[stylePropPrefix]}Left`] = styleValue;
            style[`${stylePropPrefixObj[stylePropPrefix]}Right`] = styleValue;
        } else if (stylePropOrientation === "y") {
            style[`${stylePropPrefixObj[stylePropPrefix]}Top`] = styleValue;
            style[`${stylePropPrefixObj[stylePropPrefix]}Bottom`] = styleValue;
        } else style[`${stylePropPrefixObj[stylePropPrefix]}${stylePropOrientationObj[stylePropOrientation]}`] = styleValue;

        return style;
    }

    /**
     * Try to retrieve the responsive style for `key` and log warn if not present in `allStyles`.
     * 
     * @param key 
     * @returns the responsiveStyle object for `key` or an empty object, never `undefined`
     */
    function parseResponsiveStyleKey(key: keyof ResponsiveStyle): ResponsiveStyle {
        if (isBlank(key)) return {};

        if (!allStyles.hasOwnProperty(key)) {
            logWarn(`Failed to parse responsive style. No style for key '${key}'`);
            return {};
        }

        return { key: allStyles[key] };
    }

    /**
     * @param keys invalid keys are handled gracefully, will only log. Order of keys does not matter, keys are sorted by priority.
     * @returns valid style object considering all responsive factors, adjusting on device width change
     */
    function parseResponsiveStyle(...keys: (keyof ResponsiveStyle)[]): ViewStyle & TextStyle & ImageStyle {
        if (!Object.keys(allStyles).length || !keys || !keys.length) return {};

        const combinedStyles: ValueOf<ResponsiveStyle> = {};

        // parse keys to responseiveStyle obj
        let responsiveStyles: ResponsiveStyle = {};
        keys.map((key) => parseResponsiveStyleKey(key)).forEach(
            (responsiveStyle) => (responsiveStyles = { ...responsiveStyles, ...responsiveStyle })
        );

        const sortedResponsiveStyles = sortResponsiveStyle(responsiveStyles);

        // merge into one style object
        Object.values(sortedResponsiveStyles).forEach((style) => Object.assign(combinedStyles, style));

        return combinedStyles;
    }

    /**
     * Sort ```responsiveStyle``` from small to large screen width.
     *
     * @param responsiveStyle to sort
     * @returns new instance of ```responsiveStyle``` sorted by screenWidth
     */
    function sortResponsiveStyle(responsiveStyle: ResponsiveStyle): ResponsiveStyle {
        return sortObjectByKeys(responsiveStyle, (key1, key2) => {
            let key1Index = -1;
            let key2Index = -1;
            const stylePropsScreenWidthKeys = Object.keys(stylePropScreenWidthObj);

            // find screenWidth priorities of key1 and key2 where a higher number means higher priority
            for (let i = 0; i < stylePropsScreenWidthKeys.length; i++) {
                const stylePropScreenWidth = stylePropsScreenWidthKeys[i];

                // case: blank screenWidth is included by any style obviously
                if (isBlank(stylePropScreenWidth)) continue;

                if (key1.includes(stylePropScreenWidth)) key1Index = i;

                if (key2.includes(stylePropScreenWidth)) key2Index = i;

                // case: found both
                if (key1Index !== -1 && key2Index !== -1) break;
            }

            // case: no screenWidth specified => lowest priority
            if (key1Index === -1) {
                if (key2Index !== -1) return -1;
                return 0;
            }

            if (key1Index < key2Index) return -1;

            if (key1Index === key2Index) return 0;

            return 1;
        });
    }

    return {
        allStyles,
        prs: parseResponsiveStyle,
    };
}

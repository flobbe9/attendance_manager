import { LG_MIN_WIDTH, MD_MIN_WIDTH, SM_MIN_WIDTH } from "@/utils/styleConstants";
import { isNumberFalsy } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleProp, TextStyle, useWindowDimensions, ViewStyle } from "react-native";


/**
 * NOTE: propably pretty slow, best to call this only once globally.
 * 
 * @returns bootstrap like object that updates with screen width.
 * @since 0.0.1 
 */
export function useResponsiveStyles() {

    const { width } = useWindowDimensions();
    const [allStyles, setAllStyles] = useState<Record<any, StyleProp<ViewStyle & TextStyle>>>({});
    

    useEffect(() => {
        setAllStyles(getAllStyles());

    }, [width]);
    
    
    function getAllStyles(): Record<any, StyleProp<ViewStyle & TextStyle>> {
        
        const stylePropPrefixObj = {"m": "margin", "p": "padding"};
        type StylePropPrefix = keyof typeof stylePropPrefixObj;
        const stylePropOrientationObj = {"": "", "x": 0, "y": 0, "t": "Top", "e": "Right", "b": "Bottom", "s": "Left"};
        type StylePropOrientation = keyof typeof stylePropOrientationObj;
        const stylePropScreenWidthObj = {
            "": true,
            "_sm": !isNumberFalsy(width) && width >= SM_MIN_WIDTH,
            "_md": !isNumberFalsy(width) && width >= MD_MIN_WIDTH,
            "_lg": !isNumberFalsy(width) && width >= LG_MIN_WIDTH
        };
        type StylePropScreenWidth = keyof typeof stylePropScreenWidthObj;
        const stylePropQuantifierObj = {"_0": 0, "_1": 5, "_2": 10, "_3": 20, "_4": 30, "_5": 40, "_6": 50, "_7": 60, "_8": 70, "_9": 80, "_10": 90};
        type StylePropQuantifier = keyof typeof stylePropQuantifierObj;

        /**
         * @returns a fully qualyfied style object which always contains the style prop and possibly the style value or ```undefined``` depending on the current screen width
         */
        function getStyle(stylePropQuantifier: StylePropQuantifier, stylePropOrientation: StylePropOrientation, stylePropPrefix: StylePropPrefix, stylePropScreenWidth: StylePropScreenWidth): StyleProp<ViewStyle & TextStyle> {
           
            const style = {};

            const styleValue = stylePropScreenWidthObj[stylePropScreenWidth] ? stylePropQuantifierObj[stylePropQuantifier] : undefined;
    
            if (stylePropOrientation === "x") {
                style[`${stylePropPrefixObj[stylePropPrefix]}Left`] = styleValue;
                style[`${stylePropPrefixObj[stylePropPrefix]}Right`] = styleValue;
                
            } else if (stylePropOrientation === "y") {
                style[`${stylePropPrefixObj[stylePropPrefix]}Top`] = styleValue;
                style[`${stylePropPrefixObj[stylePropPrefix]}Bottom`] = styleValue;
                
            } else 
                style[`${stylePropPrefixObj[stylePropPrefix]}${stylePropOrientationObj[stylePropOrientation]}`] = styleValue;
    
            return style;
        }

        const styleProps = {};

        (Object.keys(stylePropPrefixObj) as StylePropPrefix[]).forEach(stylePropPrefix =>
            (Object.keys(stylePropOrientationObj) as StylePropOrientation[]).forEach(stylePropOrientation =>
                (Object.keys(stylePropScreenWidthObj) as StylePropScreenWidth[]).forEach(stylePropScreenWidth =>
                    (Object.keys(stylePropQuantifierObj) as StylePropQuantifier[]).forEach(stylePropQuantifier => 
                        styleProps[`${stylePropPrefix}${stylePropOrientation}${stylePropScreenWidth}${stylePropQuantifier}`] = 
                            getStyle(stylePropQuantifier, stylePropOrientation, stylePropPrefix, stylePropScreenWidth)
        ))));

        return styleProps;
    }


    return allStyles;
}
import { ExaminantRole_Key } from "@/abstract/Examinant";
import { SchoolSubject } from "@/abstract/SchoolSubject";
import { EXAMINANT_COLOR_NO_SUBJECT, HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR, MUSIC_COLOR_TRANSPARENT } from "@/utils/styleConstants";
import { DependencyList, useEffect, useState } from "react";
import { ColorValue } from "react-native";

interface SubjectColor {
    color: ColorValue,
    transparentColor: ColorValue
}

/**
 * @param subject school subject or examinant role
 * @param defaultColor to return if subject is ```undefined```. Default see {@link getSubjectColor()}
 * @param deps 
 * @returns both color and transparent color of the subject
 */
export function useSubjectColor(subject: SchoolSubject | ExaminantRole_Key | undefined, defaultColor?: ColorValue, deps?: DependencyList): SubjectColor {
    const [subjectColor, setSubjectColor] = useState<SubjectColor>({
        color: defaultColor,
        transparentColor: defaultColor
    });

    useEffect(() => {
        setSubjectColor({
            color: getSubjectColor(subject, false, defaultColor),
            transparentColor: getSubjectColor(subject, true, defaultColor)
        });

    }, [subject, ...(deps ? deps : [])]);

    return subjectColor;
}

/**
 * @param subject school subject or examinant role
 * @param transparent indicates to use the transparent variants (not using alpha value though). Default is ```false```
 * @param defaultColor to return if subject is ```undefined```. Default is `white`
 * @returns the color of the subject or ```defaultColor```
 */
export function getSubjectColor(subject: SchoolSubject | ExaminantRole_Key | undefined, transparent = false, defaultColor: ColorValue = "white"): ColorValue {
    if (subject === "Geschichte" || subject === "history")
        return transparent ? HISTORY_COLOR_TRANSPARENT : HISTORY_COLOR;

    if (subject === "Musik" || subject === "music")
        return transparent ? MUSIC_COLOR_TRANSPARENT : MUSIC_COLOR;

    if (subject === "educator" || subject === "headmaster")
        return EXAMINANT_COLOR_NO_SUBJECT;
    
    return defaultColor;
}
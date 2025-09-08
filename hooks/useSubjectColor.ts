import { ExaminantRole_Key } from "@/abstract/Examinant";
import { getSchoolSubjectKeyBySchoolSubject, SchoolSubject } from "@/abstract/SchoolSubject";
import { EXAMINANT_COLOR_NO_SUBJECT, SUBJECT_COLORS } from "@/utils/styleConstants";
import { DependencyList, useEffect, useState } from "react";
import { ColorValue } from "react-native";

export interface SubjectColor {
    color: ColorValue,
    transparentColor: ColorValue,
    transparentColorDarker: ColorValue
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
        transparentColor: defaultColor,
        transparentColorDarker: defaultColor
    });

    useEffect(() => {
        setSubjectColor({
            color: getSubjectColor(subject, 'color', defaultColor),
            transparentColor: getSubjectColor(subject, "transparentColor", defaultColor),
            transparentColorDarker: getSubjectColor(subject, "transparentColorDarker", defaultColor)
        });

    }, [subject, ...(deps ? deps : [])]);

    return subjectColor;
}

/**
 * @param subject school subject or examinant role
 * @param variant the {@link SubjectColor} variant to use. Default is 'color'
 * @param defaultColor to return if subject is ```undefined```. Default is `white`
 * @returns the color of the subject or ```defaultColor```
 */
export function getSubjectColor(subject: SchoolSubject | ExaminantRole_Key | undefined, variant: keyof SubjectColor = 'color', defaultColor: ColorValue = "white"): ColorValue {
    if (subject === "educator" || subject === "headmaster")
        return EXAMINANT_COLOR_NO_SUBJECT;

    const subjectKey = getSchoolSubjectKeyBySchoolSubject(subject);
    if (subjectKey)
        return SUBJECT_COLORS[subjectKey][variant];
    
    return defaultColor;
}
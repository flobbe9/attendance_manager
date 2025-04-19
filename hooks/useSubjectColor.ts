import { Subject } from "@/abstract/SchoolSubject";
import { HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR, MUSIC_COLOR_TRANSPARENT } from "@/utils/styleConstants";
import { DependencyList, useEffect, useState } from "react";
import { ColorValue } from "react-native";


/**
 * @param subject 
 * @param transparent indicates to use the transparent variants (not using alpha value though). Default is ```false```
 * @param defaultColor to return if subject is ```undefined```
 * @param deps 
 * @returns the color of the subject or a greyish default
 */
export function useSubjectColor(subject: Subject | undefined, transparent = false, defaultColor =  "white", deps?: DependencyList) {

    const [subjectColor, setSubjectColor] = useState(getSubjectColor(subject, transparent));


    useEffect(() => {
        setSubjectColor(getSubjectColor(subject, transparent));

    }, [subject, ...(deps ? deps : [])]);
    
    
    /**
     * @param subject 
     * @param transparent indicates to use the transparent variants (not using alpha value though). Default is ```false```
     * @returns the color of the subject or ```defaultColor```
     */
    function getSubjectColor(subject: Subject | undefined, transparent = false): ColorValue {
    
        switch (subject) {
            case "Geschichte": 
                return transparent ? HISTORY_COLOR_TRANSPARENT : HISTORY_COLOR;
                
            case "Musik": 
                return transparent ? MUSIC_COLOR_TRANSPARENT : MUSIC_COLOR;
    
            default:
                return defaultColor;
        }
    }

    return subjectColor;
}
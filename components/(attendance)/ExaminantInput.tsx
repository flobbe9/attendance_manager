import HelperProps from "@/abstract/HelperProps";
import { ExaminantInputStyles } from "@/assets/styles/ExaminantInputStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import HelperText from "../helpers/HelperText";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { Headmaster, HEADMASTERS } from "@/abstract/Headmaster";
import { HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import { CheckboxStatus, NO_SELECTION_LABEL } from "@/utils/constants";
import { AttendanceContext } from "@/app/(attendance)/_layout";
import { ExaminantEntity } from "@/backend/DbSchema";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function ExaminantInput({...props}: Props) {

    const { updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const [historyExaminantStatus, setHistoryExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [musicExaminantStatus, setMusicExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [educatorExaminantStatus, setEducatorExaminantStatus] = useState<CheckboxStatus>("unchecked");
    
    const [isHeadmaster, setIsHeadMaster] = useState(false);
    const [selectedHeadmaster, setSelectedHeadMaster] = useState<Headmaster | typeof NO_SELECTION_LABEL>();

    const componentName = "ExaminantInput";
    const { children, ...otherProps } = useHelperProps(props, componentName, ExaminantInputStyles.component);


    useEffect(() => {
        handleStatusChange();

    }, [historyExaminantStatus, musicExaminantStatus, educatorExaminantStatus, isHeadmaster, selectedHeadmaster]);


    function handleStatusChange(): void {

        const examinants: ExaminantEntity[] = [];

        if (historyExaminantStatus === "checked")
            examinants.push({role: "history"});
        
        if (musicExaminantStatus === "checked")
            examinants.push({role: "music"});
        
        if (educatorExaminantStatus === "checked")
            examinants.push({role: "educator"});
        
        if (isHeadmaster)
            examinants.push({role: "headmaster", fullName: selectedHeadmaster === NO_SELECTION_LABEL ? undefined : selectedHeadmaster});

        updateCurrentAttendanceEntity("examinants", examinants);
    }


    return (
        <HelperView {...otherProps}>
            <HelperText dynamicStyle={AttendanceStyles.heading} style={{marginBottom: 0}}>Anwesende Prüfer</HelperText>

            <Flex flexWrap="nowrap">
                {/* Subjects */}
                <HelperView dynamicStyle={ExaminantInputStyles.iconContainer}>
                    <FontAwesome 
                        name={historyExaminantStatus === "checked" ? "user" : "user-o"} 
                        color={HISTORY_COLOR} 
                        style={{...ExaminantInputStyles.icon, fontSize: historyExaminantStatus === "checked" ? 35 : 30}}
                        onPress={(e) => setHistoryExaminantStatus(historyExaminantStatus === "checked" ? "unchecked" : "checked")}
                    />
                </HelperView>

                <HelperView dynamicStyle={ExaminantInputStyles.iconContainer}>
                    <FontAwesome 
                        name={musicExaminantStatus === "checked" ? "user" : "user-o"}
                        color={MUSIC_COLOR}
                        style={{...ExaminantInputStyles.icon, fontSize: musicExaminantStatus === "checked" ? 35 : 30}}
                        onPress={(e) => setMusicExaminantStatus(musicExaminantStatus === "checked" ? "unchecked" : "checked")}
                    />
                </HelperView>

                <HelperView dynamicStyle={ExaminantInputStyles.iconContainer}>
                    <FontAwesome
                        name={educatorExaminantStatus === "checked" ? "user" : "user-o"} 
                        color={"black"} 
                        style={{...ExaminantInputStyles.icon, fontSize: educatorExaminantStatus === "checked" ? 35 : 30}}
                        onPress={(e) => setEducatorExaminantStatus(educatorExaminantStatus === "checked" ? "unchecked" : "checked")}
                    />
                </HelperView>
    
                {/* Headmaster */}
                <Flex 
                    flexWrap="nowrap" 
                    alignItems="flex-start" 
                    flexShrink={1} 
                    style={{marginLeft: 20}} 
                    dynamicStyle={ExaminantInputStyles.iconContainer}
                >
                    <FontAwesome
                        name={isHeadmaster ? "user-plus" : "user-o"} 
                        color={"black"} 
                        style={{...ExaminantInputStyles.icon, fontSize: isHeadmaster ? 32 : 30}}
                        onPress={(e) => setIsHeadMaster(!isHeadmaster)}
                    />
                    
                    <HelperSelect  
                        style={{flexShrink: 1}}
                        rendered={isHeadmaster}
                        options={[NO_SELECTION_LABEL, ...HEADMASTERS] as (Headmaster | typeof NO_SELECTION_LABEL)[]} 
                        selectedOptions={selectedHeadmaster}
                        setSelectedOptions={setSelectedHeadMaster} 
                        optionsContainerHeight={121}
                        optionsContainerScroll={false}
                    >
                        <HelperText>Schulleitung</HelperText>
                    </HelperSelect>
                </Flex>
            </Flex>
        </HelperView>
    )
}
import { Headmaster, HEADMASTERS } from "@/abstract/Headmaster";
import HelperProps from "@/abstract/HelperProps";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { ExaminantInputStyles } from "@/assets/styles/ExaminantInputStyles";
import { ExaminantEntity } from "@/backend/DbSchema";
import { AttendanceService } from "@/backend/services/AttendanceService";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { CheckboxStatus, NO_SELECTION_LABEL } from "@/utils/constants";
import { HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function ExaminantInput({...props}: Props) {

    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const [historyExaminantStatus, setHistoryExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    const [musicExaminantStatus, setMusicExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    const [educatorExaminantStatus, setEducatorExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    
    const [isHeadmaster, setIsHeadMaster] = useState(false);
    const [selectedHeadmaster, setSelectedHeadMaster] = useState<Headmaster | typeof NO_SELECTION_LABEL>();

    /** Indicates that all checkbox states have been initialized with `currentAttendanceEntity` values  */
    const [initializedCheckboxes, setInitializedCheckboxes] = useState(false);

    const componentName = "ExaminantInput";
    const { children, ...otherProps } = useHelperProps(props, componentName, ExaminantInputStyles.component);

    const attendanceService = new AttendanceService();


    useEffect(() => {
        initializeStates();

    }, []);


    useEffect(() => {
        // case: states initialized already
        if (initializedCheckboxes)
            updateCurrentAttendanceEntityExaminants();

    }, [historyExaminantStatus, musicExaminantStatus, educatorExaminantStatus, isHeadmaster, selectedHeadmaster]);


    function initializeStates(): void {

        setHistoryExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "history") ? "checked" : "unchecked");
        setMusicExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "music") ? "checked" : "unchecked");
        setEducatorExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "educator") ? "checked" : "unchecked");
        
        const [headMasterExaminant, headMasterExaminantIndex] = attendanceService.getExaminantByRole(currentAttendanceEntity, "headmaster");
        setIsHeadMaster(!!headMasterExaminant);
        setSelectedHeadMaster(headMasterExaminant ? (headMasterExaminant.fullName as Headmaster | null) : NO_SELECTION_LABEL);

        // call this last
        setTimeout(() => {
            setInitializedCheckboxes(true);
        }, 500); // wait for other states to activate useEffect
    }


    function updateCurrentAttendanceEntityExaminants(): void {

        const examinants: ExaminantEntity[] = currentAttendanceEntity.examinants;

        if (historyExaminantStatus === "checked")
            attendanceService.addExaminantByRole(currentAttendanceEntity, "history");
        else if (historyExaminantStatus === "unchecked")
            attendanceService.removeExaminant(currentAttendanceEntity, "history");

        if (musicExaminantStatus === "checked")
            attendanceService.addExaminantByRole(currentAttendanceEntity, "music");
        else if (musicExaminantStatus === "unchecked")
            attendanceService.removeExaminant(currentAttendanceEntity, "music");

        if (educatorExaminantStatus === "checked")
            attendanceService.addExaminantByRole(currentAttendanceEntity, "educator");
        else if (educatorExaminantStatus === "unchecked")
            attendanceService.removeExaminant(currentAttendanceEntity, "educator");
        
        if (isHeadmaster)
            attendanceService.addOrUpdateExaminantByRole(currentAttendanceEntity, {role: "headmaster", fullName: selectedHeadmaster === NO_SELECTION_LABEL ? null : selectedHeadmaster});
        else if (!isHeadmaster)
            attendanceService.removeExaminant(currentAttendanceEntity, "headmaster");

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
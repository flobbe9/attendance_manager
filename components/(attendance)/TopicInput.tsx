import HelperProps from "@/abstract/HelperProps";
import { getMusicLessonTopicByMusicLessonTopicKey, getMusicLessonTopicKeyByMusicLessonTopic, MUSIC_LESSON_TOPICS, MusicLessonTopic } from "@/abstract/MusicLessonTopic";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function TopicInput({...props}: Props) {
    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "TopicInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    function handleOptionSelect(value: MusicLessonTopic) {
        updateCurrentAttendanceEntity("musicLessonTopic", getMusicLessonTopicKeyByMusicLessonTopic(value));
    }

    return (
        <HelperSelect 
            rendered={currentAttendanceEntity.schoolSubject === "music"}
            options={[NO_SELECTION_LABEL, ...MUSIC_LESSON_TOPICS]}
            selectedOptions={getMusicLessonTopicByMusicLessonTopicKey(currentAttendanceEntity.musicLessonTopic)}
            setSelectedOptions={handleOptionSelect}
            optionsContainerScroll={false}
            optionsContainerHeight={243}
            {...otherProps}
        >
            <HelperText dynamicStyle={AttendanceStyles.heading}>Stundenthema</HelperText>
        </HelperSelect>
    )
}
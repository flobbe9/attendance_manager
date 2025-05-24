import HelperProps from "@/abstract/HelperProps";
import { MUSIC_LESSON_TOPICS, MusicLessonTopic } from "@/abstract/MusicLessonTopic";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
;


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function TopicInput({...props}: Props) {

    const { currentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "TopicInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    return (
        <HelperSelect 
            rendered={currentAttendanceEntity.schoolSubject === "music"}
            options={MUSIC_LESSON_TOPICS}
            selectedOptions={currentAttendanceEntity.musicLessonTopic}
            setSelectedOptions={(value) => updateCurrentAttendanceEntity("musicLessonTopic", value as MusicLessonTopic)}
            optionsContainerScroll={false}
            optionsContainerHeight={203}
            {...otherProps}
        >
            <HelperText dynamicStyle={AttendanceStyles.heading}>Stundenthema</HelperText>
        </HelperSelect>
    )
}
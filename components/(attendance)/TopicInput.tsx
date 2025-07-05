import HelperProps from "@/abstract/HelperProps";
import { getMusicLessonTopicByMusicLessonTopicKey, getMusicLessonTopicKeyByMusicLessonTopic, MUSIC_LESSON_TOPICS, MusicLessonTopic, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import { useHelperProps } from "@/hooks/useHelperProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { isBlank } from "@/utils/utils";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function TopicInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput } = useContext(AttendanceContext);

    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .inputType("musicLessonTopic")
        .build();

    const schoolYearValidator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .inputType("schoolYear")
        .build();

    const componentName = "TopicInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    function handleOptionSelect(value: MusicLessonTopic): void {
        if (validator.shouldInputBeValidated(value)) {
            const errorMessage = validator.validate(value);

            if (!isBlank(errorMessage)) {
                handleInvalidAttendanceInput(
                    value, 
                    errorMessage,
                    "musicLessonTopic");

                return;
            }
        }
         
        updateCurrentAttendanceEntity(["musicLessonTopic", getMusicLessonTopicKeyByMusicLessonTopic(value)]);
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
            <Flex alignItems="center">
                <HelperText dynamicStyle={AttendanceStyles.heading}>Stundenthema</HelperText>
                
                <AttendanceInputTooltip 
                    attendanceInputKey={"musicLessonTopic"} 
                    validator={validator}
                    valueToStringPretty={(value) => getMusicLessonTopicByMusicLessonTopicKey(value as MusicLessonTopic_Key)}
                />
            </Flex>
        </HelperSelect>
    )
}
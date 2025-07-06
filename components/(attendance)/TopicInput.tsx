import HelperProps from "@/abstract/HelperProps";
import { getMusicLessonTopicByMusicLessonTopicKey, getMusicLessonTopicKeyByMusicLessonTopic, MUSIC_LESSON_TOPICS, MusicLessonTopic, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import { useHelperProps } from "@/hooks/useHelperProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { isBlank } from "@/utils/utils";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";
import { logDebug } from "@/utils/logUtils";
import { AttendanceService } from "@/backend/services/AttendanceService";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function TopicInput({...props}: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput } = useContext(AttendanceContext);

    const [validValues, setValidValues] = useState<MusicLessonTopic_Key[]>([]);

    const validator = AttendanceInputValidatorBuilder
        .builder(currentAttendanceEntity, savedAttendanceEntities)
        .inputType("musicLessonTopic")
        .build();

    const componentName = "TopicInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        setValidValues(validator.getValidValues() as MusicLessonTopic_Key[]);
    }, [currentAttendanceEntity])

    function handleOptionSelect(value: MusicLessonTopic): void {
        if (validator.shouldInputBeValidated(getMusicLessonTopicKeyByMusicLessonTopic(value))) {
            const errorMessage = validator.validate(getMusicLessonTopicKeyByMusicLessonTopic(value));

            if (!isBlank(errorMessage)) {
                handleInvalidAttendanceInput(
                    getMusicLessonTopicKeyByMusicLessonTopic(value), 
                    errorMessage,
                    "musicLessonTopic");

                return;
            }
        }
         
        updateCurrentAttendanceEntity(["musicLessonTopic", getMusicLessonTopicKeyByMusicLessonTopic(value)]);
    }

    /**
     * @param value 
     * @param index 
     * @returns one music lesson topic formatted for tooltip body
     */
    function formatTooltipLessonTopic(value: MusicLessonTopic_Key, index: number): string {
        const musicLessonTopic = getMusicLessonTopicByMusicLessonTopicKey(value);
        const prefix = musicLessonTopic.length > 15 && index >= 1 ? '\n' : '';
        return `${prefix}${getMusicLessonTopicByMusicLessonTopicKey(value)}`;
    }

    return (
        <Fragment>
            {/* one higher than parent or 1 */}
            <Flex alignItems="center" style={{zIndex: (((otherProps.style as ViewStyle).zIndex) ?? 0) + 1}}>
                <HelperText dynamicStyle={AttendanceStyles.heading}>Stundenthema</HelperText>
                
                <AttendanceInputTooltip 
                    attendanceInputKey={"musicLessonTopic"} 
                    validator={validator}
                    valueToStringPretty={formatTooltipLessonTopic}
                    textContainerStyles={{maxWidth: 300}}
                    position="top"
                    values={validValues}
                />
            </Flex>

            <HelperSelect 
                rendered={currentAttendanceEntity.schoolSubject === "music"}
                options={[NO_SELECTION_LABEL, ...MUSIC_LESSON_TOPICS]}
                selectedOptions={getMusicLessonTopicByMusicLessonTopicKey(currentAttendanceEntity.musicLessonTopic)}
                setSelectedOptions={handleOptionSelect}
                disabledCondition={(optionValue) => 
                    !validValues.includes(getMusicLessonTopicKeyByMusicLessonTopic(optionValue as MusicLessonTopic)) &&
                    new AttendanceService().isSelectInputFilledOut(optionValue as string)}
                optionsContainerScroll={false}
                optionsContainerHeight={243}
                {...otherProps}
            />
        </Fragment>
    )
}
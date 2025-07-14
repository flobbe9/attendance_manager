import HelperProps from "@/abstract/HelperProps";
import { getMusicLessonTopicByMusicLessonTopicKey, getMusicLessonTopicKeyByMusicLessonTopic, MUSIC_LESSON_TOPICS, MusicLessonTopic, MusicLessonTopic_Key } from "@/abstract/MusicLessonTopic";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import { useHelperProps } from "@/hooks/useHelperProps";
import { NO_SELECTION_LABEL } from "@/utils/constants";
import { isBlank } from "@/utils/utils";
import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
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

    const isOptionDisabled = useCallback((optionValue: string): boolean => {
        // is topic not a valid value and not the "no selection" label
        return !validValues.includes(getMusicLessonTopicKeyByMusicLessonTopic(optionValue as MusicLessonTopic)) &&
            new AttendanceService().isSelectInputFilledOut(optionValue as string);
    }, [validValues]);

    return (
        <Fragment>
            {/* one higher than parent or 1 */}
            <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Stundenthema</HelperText>

            <HelperSelect 
                rendered={currentAttendanceEntity.schoolSubject === "music"}
                options={[NO_SELECTION_LABEL, ...MUSIC_LESSON_TOPICS]}
                selectedOptions={getMusicLessonTopicByMusicLessonTopicKey(currentAttendanceEntity.musicLessonTopic)}
                setSelectedOptions={handleOptionSelect}
                disabledCondition={isOptionDisabled}
                optionsContainerScroll={false}
                optionsContainerHeight={243}
                {...otherProps}
            />
        </Fragment>
    )
}
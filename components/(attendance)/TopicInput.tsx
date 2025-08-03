import HelperProps from "@/abstract/HelperProps";
import {
    getMusicLessonTopicByMusicLessonTopicKey,
    getMusicLessonTopicKeyByMusicLessonTopic,
    MUSIC_LESSON_TOPICS,
    MusicLessonTopic,
    MusicLessonTopic_Key,
} from "@/abstract/MusicLessonTopic";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import { useHelperProps } from "@/hooks/useHelperProps";
import { isBlank, shortenString } from "@/utils/utils";
import React, { Fragment, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Text, ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import HelperView from "../helpers/HelperView";
import AttendanceInputTooltip from "./AttendanceInputTooltip";
import Flex from "../helpers/Flex";
import HelperStyles from "@/assets/styles/helperStyles";
import Br from "../helpers/Br";
import B from "../helpers/B";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function TopicInput({ ...props }: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput } = useContext(AttendanceContext);

    // return map of <invalid value key, error message>
    const [inValidValues, setInvalidValues] = useState<Map<MusicLessonTopic_Key, string>>(new Map());

    const validator = AttendanceInputValidatorBuilder.builder(currentAttendanceEntity, savedAttendanceEntities).inputType("musicLessonTopic").build();

    const componentName = "TopicInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    useEffect(() => {
        setInvalidValues(validator.getInvalidValues() as Map<MusicLessonTopic_Key, string>);
    }, [currentAttendanceEntity]);

    function handleOptionSelect(value: MusicLessonTopic): void {
        if (validator.shouldInputBeValidated(getMusicLessonTopicKeyByMusicLessonTopic(value))) {
            const errorMessage = validator.validate(getMusicLessonTopicKeyByMusicLessonTopic(value));

            if (!isBlank(errorMessage)) {
                handleInvalidAttendanceInput(getMusicLessonTopicKeyByMusicLessonTopic(value), errorMessage, "musicLessonTopic");

                return;
            }
        }

        updateCurrentAttendanceEntity(["musicLessonTopic", getMusicLessonTopicKeyByMusicLessonTopic(value)]);
    }

    const isOptionDisabled = useCallback(
        (optionValue: string): boolean => {
            // is topic not a valid value and not the "no selection" label
            return (
                inValidValues.has(getMusicLessonTopicKeyByMusicLessonTopic(optionValue as MusicLessonTopic)) &&
                new AttendanceService().isSelectInputFilledOut(optionValue as string)
            );
        },
        [inValidValues]
    );

    return (
        <HelperView {...otherProps}>
            <Flex 
                alignItems="center" 
                style={{ zIndex: 2 }} // higher than select
            >
                <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Stundenthema</HelperText>

                <AttendanceInputTooltip
                    values={inValidValues}
                    attendanceInputKey={"musicLessonTopic"}
                    validator={validator}
                />
            </Flex>

            <HelperSelect
                options={MUSIC_LESSON_TOPICS}
                selectedOptions={getMusicLessonTopicByMusicLessonTopicKey(currentAttendanceEntity.musicLessonTopic)}
                setSelectedOptions={handleOptionSelect}
                disabledCondition={isOptionDisabled}
                optionsContainerScroll={false}
                selectionButtonProps={{
                    dynamicStyle: AttendanceIndexStyles.defaultHelperButton,
                    ripple: { rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground },
                }}
                optionButtonProps={{
                    ripple: { rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground },
                }}
            />
        </HelperView>
    );
}

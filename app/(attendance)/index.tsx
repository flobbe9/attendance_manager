import DefaultProps from "@/abstract/DefaultProps";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { SchoolclassMode } from "@/abstract/SchoolclassMode";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import "@/assets/styles/AttendanceStyles.ts";
import { AttendanceEntity } from "@/backend/entities/Attendance_Schema";
import ExaminantInput from "@/components/(attendance)/ExaminantInput";
import SchoolSubjectInput from "@/components/(attendance)/SchoolSubjectInput";
import SchoolYearInput from "@/components/(attendance)/SchoolYearInput";
import TopicInput from "@/components/(attendance)/TopicInput";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useSubjectColor } from "@/hooks/useSubjectColor";
import { log } from "@/utils/logUtils";
import { BORDER_RADIUS, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import DateInput from './../../components/(attendance)/DateInput';
import SchoolclassModeInput from "@/components/(attendance)/SchoolclassModeInput";


interface Props extends DefaultProps<ViewStyle>, ViewProps {

}


/**
 * Attendance create / edit screen.
 * 
 * @since 0.0.1
 */
export default function index(props: Props) {


    const { currentAttendanceEntity, setCurrentAttendanceEntity } = useContext(GlobalAttendanceContext);
    // get current attendance id from global state
    // on load
        // load current attendance
        // if id null     
            // just set to empty object
        // pass attendance down to index context

    // modified

    // 

    const { allStyles: { pe_2 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();
    const { transparentColor: subjectColor} = useSubjectColor(currentAttendanceEntity.schoolSubject, "rgb(240, 240, 240)");

    const [areNotesVisible, setAreNotesVisible] = useState(false);

    const { animatedStyle: animatedArrowIconRotation } = useAnimatedStyle(
        [0, 180],
        ["0deg", "-180deg"],
        {
            reverse: !areNotesVisible,
        }
    )

    const componentName = "Attendance";
    const { children, style, ...otherProps } = useDefaultProps(props, componentName, AttendanceStyles.component);

    const numHelperInputLines = 20;


    useEffect(() => {
        log(currentAttendanceEntity.note)
    }, [currentAttendanceEntity])



    function handleSavePress(): void {

        
    }


    function updateCurrentAttendanceEntity(prop: keyof AttendanceEntity, value: ValueOf<AttendanceEntity>): void {
        
        setCurrentAttendanceEntity({
            ...currentAttendanceEntity,
            [prop]: value
        })
    }


    // TODO: 
        // confirm leave if unsaved changes
        // component for each input
        // validation
            // flash input as invalid (?)
                // flash tooltip(?)
            // small popup with short description, dismissable with action
                // "invalid value, see tooltip for valid options"
            // tooltip next to every input label
                // explain logic shortly
                // list valid options
                // make a component for that?
        // disable all inputs when date is in past
        // multiline max height
            // consider tablet
            // consider full screen
        // fix icons

    return (
        <ScreenWrapper 
            style={{
                backgroundColor: subjectColor,
                ...style as object
            }} 
            {...otherProps}
        >
            <Flex justifyContent="flex-end" dynamicStyle={AttendanceStyles.topBar}>
                {/* Save button */}
                <HelperButton dynamicStyle={AttendanceStyles.saveButton} onPress={handleSavePress}>
                    <FontAwesome name="save" style={{...pr({pe_2})}} />
                    <HelperText>Save</HelperText>
                </HelperButton>
            </Flex>

            <HelperScrollView dynamicStyle={AttendanceStyles.scrollView}>
                <SchoolSubjectInput dynamicStyle={AttendanceStyles.inputContainer} />

                <DateInput dynamicStyle={AttendanceStyles.inputContainer} />

                <SchoolYearInput dynamicStyle={AttendanceStyles.inputContainer} />

                <TopicInput 
                    dynamicStyle={AttendanceStyles.inputContainer}
                    style={{zIndex: 2}} // needs to be higher than next sibling
                />

                <ExaminantInput 
                    dynamicStyle={AttendanceStyles.inputContainer} 
                    style={{zIndex: 2 /* for select container */}}
                />

                <Flex justifyContent="center" dynamicStyle={AttendanceStyles.notesContainer}>
                    {/* Toggle notes */}
                    <HelperButton 
                        disableFlex={true} 
                        style={{borderRadius: BORDER_RADIUS, width: 100}} 
                        onPress={() => setAreNotesVisible(!areNotesVisible)}
                    >
                        <HelperText>Mehr</HelperText>
                        <HelperView
                            style={{
                                transform: [{rotate: animatedArrowIconRotation}]
                            }} 
                        >
                            <FontAwesome name={"chevron-down"} size={20} />
                        </HelperView>
                    </HelperButton>
                </Flex>

                <HelperView rendered={areNotesVisible}>
                    {/* Note */}
                    <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                        <HelperInput 
                            multiline
                            numberOfLines={numHelperInputLines}
                            placeholder="Thema"
                            dynamicStyle={AttendanceStyles.defaultMultilineHelperInput}
                            containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                            value={currentAttendanceEntity.note}
                            setValue={(value) => updateCurrentAttendanceEntity("note", value)}
                        />
                    </HelperView>

                    {/* Note2 */}
                    <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                        <HelperInput 
                            multiline
                            numberOfLines={numHelperInputLines}
                            placeholder="Lerngruppe"
                            dynamicStyle={AttendanceStyles.defaultMultilineHelperInput}
                            containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                            value={currentAttendanceEntity.note2}
                            setValue={(value) => updateCurrentAttendanceEntity("note2", value)}
                        />
                    </HelperView>

                    <SchoolclassModeInput dynamicStyle={AttendanceStyles.inputContainer} />
                </HelperView>
            </HelperScrollView>
        </ScreenWrapper>
    )
}
import DefaultProps from "@/abstract/DefaultProps";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { Headmaster, HEADMASTERS } from "@/abstract/Headmaster";
import { MUSIC_LESSON_TOPICS, MusicLessonTopic } from "@/abstract/MusicLessonTopic";
import { SCHOOLCLASS_MODES, SchoolclassMode } from "@/abstract/SchoolclassMode";
import { getSchoolSubjectBySchoolSubjectKey, SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import "@/assets/styles/AttendanceStyles.ts";
import { IndexContext } from "@/components/context/IndexContextProvider";
import DatePicker from "@/components/helpers/DatePicker";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperSelect from "@/components/helpers/HelperSelect";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import Tooltip from "@/components/helpers/Tooltip";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useSubjectColor } from "@/hooks/useSubjectColor";
import { CheckboxStatus } from "@/utils/constants";
import { log } from "@/utils/logUtils";
import { BORDER_RADIUS, HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";


interface Props extends DefaultProps<ViewStyle>, ViewProps {

}


/**
 * Attendance create / edit screen.
 * 
 * @since 0.0.1
 */
export default function index(props: Props) {


    const { currentAttendanceEntity } = useContext(IndexContext);
    // get current attendance id from global state
    // on load
        // load current attendance
        // if id null     
            // just set to empty object
        // pass attendance down to index context

    // modified

    // 

    const { allStyles: { pe_2 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();
    const [date, setDate] = useState<CalendarDate>(new Date());
    
    const [selectedSubject, setSelectedSubject] = useState<SchoolSubject>(getSchoolSubjectBySchoolSubjectKey(currentAttendanceEntity.schoolSubject));
    const { transparentColor: subjectColor} = useSubjectColor(selectedSubject, "rgb(240, 240, 240)");

    const [selectedMusicLessonTopic, setSelectedMusicLessonTopic] = useState<MusicLessonTopic>();

    const [schoolYear, setSchoolYear] = useState<string>("");

    const [historyExaminantStatus, setHistoryExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [musicExaminantStatus, setMusicExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [educatorExaminantStatus, setEducatorExaminantStatus] = useState<CheckboxStatus>("unchecked");
    
    const [isHeadmaster, setIsHeadMaster] = useState(false);
    const [selectedHeadmaster, setSelectedHeadMaster] = useState<Headmaster>();
    
    const [areNotesVisible, setAreNotesVisible] = useState(false);

    const [schoolclassMode, setSchoolclassMode] = useState<SchoolclassMode>("Eigenverantwortlicher Unterricht");
    const [schoolclassModeRadioButtons, setSchoolclassModeRadioButtons] = useState<JSX.Element[]>([]); 

    const { animatedStyle } = useAnimatedStyle(
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
        setSchoolclassModeRadioButtons(mapSchoolclassModeRadioButtons());

    }, [schoolclassMode]);


    function mapSchoolclassModeRadioButtons(): JSX.Element[] {

        return SCHOOLCLASS_MODES.map((mode, i) => (
            <Flex alignItems="center" key={i}>
                <RadioButton.IOS value={mode} />
                <HelperText onPress={() => setSchoolclassMode(mode)}>{mode}</HelperText>
            </Flex>
        ));
    }


    function handleSavePress(): void {

        
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
            {/* Verbose popup */}
            {/* <Portal>
                <Modal visible={true} contentContainerStyle={{backgroundColor: "white", height: "50%", margin: "auto", padding: 20}}>
                    <HelperText>Some popup text</HelperText>
                </Modal>
            </Portal> */}

            {/* TopBar */}
            <Flex justifyContent="flex-end" dynamicStyle={AttendanceStyles.topBar}>
                {/* Save */}
                <HelperButton dynamicStyle={AttendanceStyles.saveButton} onPress={handleSavePress}>
                    <FontAwesome name="save" style={{...pr({pe_2})}} />
                    <HelperText>Save</HelperText>
                </HelperButton>
            </Flex>

            <HelperScrollView>
                {/* Subject */}  
                <HelperSelect 
                    dynamicStyle={AttendanceStyles.inputContainer}
                    options={SCHOOL_SUBJECTS}
                    selectedOptions={selectedSubject}
                    setSelectedOptions={setSelectedSubject}
                    optionsContainerScroll={false}
                    optionsContainerHeight={85}
                >
                    <Flex alignItems="center">
                        <HelperText dynamicStyle={AttendanceStyles.heading}>Fach</HelperText>
                        <Tooltip>
                            8 UBs pro Fach
                        </Tooltip>
                    </Flex>
                </HelperSelect>

                {/* Date */}
                <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                    <HelperText dynamicStyle={AttendanceStyles.heading}>Datum</HelperText>
                    <DatePicker date={date} setDate={setDate} />
                </HelperView>

                {/* Year */}
                <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                    <HelperText dynamicStyle={AttendanceStyles.heading}>Jahrgang</HelperText>
                    <HelperInput 
                        value={schoolYear}
                        setValue={setSchoolYear}
                        placeholder="5 - 13"
                        keyboardType="numeric"
                        containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                    />
                </HelperView>

                {/* Topic */}
                <HelperSelect 
                    rendered={selectedSubject === "Musik"}
                    dynamicStyle={AttendanceStyles.inputContainer}
                    options={MUSIC_LESSON_TOPICS}
                    selectedOptions={selectedMusicLessonTopic}
                    setSelectedOptions={setSelectedMusicLessonTopic}
                    optionsContainerScroll={false}
                    optionsContainerHeight={210}
                    style={{zIndex: 2}} // needs to be higher than next sibling
                >
                    <HelperText dynamicStyle={AttendanceStyles.heading}>Stundenthema</HelperText>
                </HelperSelect>

                {/* Examinants */}
                <HelperView dynamicStyle={AttendanceStyles.inputContainer} style={{zIndex: 1/* for select container */}}>
                    <HelperText dynamicStyle={AttendanceStyles.heading} style={{marginBottom: 0}}>Anwesende Prüfer</HelperText>

                    <Flex flexWrap="nowrap">
                        {/* Subjects */}
                        <HelperView dynamicStyle={AttendanceStyles.examinerIconContainer}>
                            <FontAwesome 
                                name={historyExaminantStatus === "checked" ? "user" : "user-o"} 
                                color={HISTORY_COLOR} 
                                style={{...AttendanceStyles.examinerIcon, fontSize: historyExaminantStatus === "checked" ? 35 : 30}}
                                onPress={(e) => setHistoryExaminantStatus(historyExaminantStatus === "checked" ? "unchecked" : "checked")}
                            />
                        </HelperView>

                        <HelperView dynamicStyle={AttendanceStyles.examinerIconContainer}>
                            <FontAwesome 
                                name={musicExaminantStatus === "checked" ? "user" : "user-o"}
                                color={MUSIC_COLOR}
                                style={{...AttendanceStyles.examinerIcon, fontSize: musicExaminantStatus === "checked" ? 35 : 30}}
                                onPress={(e) => setMusicExaminantStatus(musicExaminantStatus === "checked" ? "unchecked" : "checked")}
                            />
                        </HelperView>

                        <HelperView dynamicStyle={AttendanceStyles.examinerIconContainer}>
                            <FontAwesome
                                name={educatorExaminantStatus === "checked" ? "user" : "user-o"} 
                                color={"black"} 
                                style={{...AttendanceStyles.examinerIcon, fontSize: educatorExaminantStatus === "checked" ? 35 : 30}}
                                onPress={(e) => setEducatorExaminantStatus(educatorExaminantStatus === "checked" ? "unchecked" : "checked")}
                            />
                        </HelperView>
            
                        {/* Headmaster */}
                        <Flex 
                            flexWrap="nowrap" 
                            alignItems="flex-start" 
                            flexShrink={1} 
                            style={{marginLeft: 20}} 
                            dynamicStyle={AttendanceStyles.examinerIconContainer}
                        >
                            <FontAwesome
                                name={isHeadmaster ? "user-plus" : "user-o"} 
                                color={"black"} 
                                style={{...AttendanceStyles.examinerIcon, fontSize: isHeadmaster ? 32 : 30}}
                                onPress={(e) => setIsHeadMaster(!isHeadmaster)}
                            />
                            
                            <HelperSelect  
                                style={{flexShrink: 1}}
                                rendered={isHeadmaster}
                                options={HEADMASTERS} 
                                selectedOptions={selectedHeadmaster}
                                setSelectedOptions={setSelectedHeadMaster} 
                                optionsContainerHeight={85}
                                optionsContainerScroll={false}
                            >
                                <HelperText>Schulleitung</HelperText>
                            </HelperSelect>
                        </Flex>
                    </Flex>
                </HelperView>

                {/* Toggle notes */}
                <Flex justifyContent="center" dynamicStyle={AttendanceStyles.notesContainer}>
                    <HelperButton 
                        disableFlex={true} 
                        style={{borderRadius: BORDER_RADIUS, width: 100}} 
                        onPress={() => setAreNotesVisible(!areNotesVisible)}
                    >
                        <HelperText>Mehr</HelperText>
                        <HelperView
                            style={{
                                transform: [{rotate: animatedStyle}]
                            }} 
                        >
                            <FontAwesome name={"chevron-down"} size={20} />
                        </HelperView>
                    </HelperButton>
                </Flex>

                {/* Notes */}
                <HelperView rendered={areNotesVisible}>
                    {/* Note */}
                    <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                        <HelperInput 
                            multiline
                            numberOfLines={numHelperInputLines}
                            placeholder="Thema"
                            dynamicStyle={AttendanceStyles.defaultMultilineHelperInput}
                            containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
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
                        />
                    </HelperView>

                    {/* Own/Other class */}
                    <HelperView dynamicStyle={AttendanceStyles.inputContainer}>
                        <RadioButton.Group value={schoolclassMode} onValueChange={(mode) => setSchoolclassMode(mode as SchoolclassMode)}>
                            {schoolclassModeRadioButtons}
                        </RadioButton.Group>

                        <HelperInput
                            placeholder="Ausbildungslehrer"
                            rendered={schoolclassMode === "Ausbildungsunterricht"}
                            containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                        />
                    </HelperView>
                </HelperView>
            </HelperScrollView>
        </ScreenWrapper>
    )
}
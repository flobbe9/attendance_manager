import DefaultProps from "@/abstract/DefaultProps";
import { Headmaster, HEADMASTERS } from "@/abstract/Headmaster";
import { MUSIC_LESSON_TOPICS, MusicLessonTopic } from "@/abstract/MusicLessonTopic";
import { SCHOOLCLASS_MODES, SchoolclassMode, schoolclassModeObj } from "@/abstract/SchoolclassMode";
import { SCHOOL_SUBJECTS, SchoolSubject } from "@/abstract/SchoolSubject";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import "@/assets/styles/AttendanceStyles.ts";
import DatePicker from "@/components/helpers/DatePicker";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperSelect from "@/components/helpers/HelperSelect";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyles } from "@/hooks/useAnimatedStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useSubjectColor } from "@/hooks/useSubjectColor";
import { CheckboxStatus } from "@/utils/constants";
import { BORDER_RADIUS, HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, ViewProps, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";


interface Props extends DefaultProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function index(props: Props) {

    const [date, setDate] = useState<CalendarDate>(new Date());
    
    const [selectedSubject, setSelectedSubject] = useState<SchoolSubject>();
    const subjectColor = useSubjectColor(selectedSubject, true, "rgb(240, 240, 240)");

    const [selectedMusicLessonTopic, setSelectedMusicLessonTopic] = useState<MusicLessonTopic>();

    const [historyExaminantStatus, setHistoryExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [musicExaminantStatus, setMusicExaminantStatus] = useState<CheckboxStatus>("unchecked");
    const [educatorExaminantStatus, setEducatorExaminantStatus] = useState<CheckboxStatus>("unchecked");
    
    const [isHeadmaster, setIsHeadMaster] = useState(false);
    const [selectedHeadmaster, setSelectedHeadMaster] = useState<Headmaster>();
    
    const [areNotesVisible, setAreNotesVisible] = useState(false);

    const [schoolclassMode, setSchoolclassMode] = useState<SchoolclassMode>("Eigenverantwortlicher Unterricht");
    const [schoolclassModeRadioButtons, setSchoolclassModeRadioButtons] = useState<JSX.Element[]>([]); 

    const { animatedStyle } = useAnimatedStyles(
        [0, 180],
        ["0deg", "-180deg"],
        !areNotesVisible,
        [areNotesVisible]
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


    // TODO: 
        // validation
        // disable all inputs when date is in past
        // multiline max height
            // consider tablet
            // consider full screen
        // figure out grid thing
            // do myself
        // fix icons


    return (
        <SafeAreaView style={{height: "100%"}}>
            <HelperScrollView 
                style={{
                    backgroundColor: subjectColor,
                    ...style as object
                }} 
                {...otherProps}
            >
                {/* Subject */}
                <HelperSelect 
                    dynamicStyles={AttendanceStyles.inputContainer}
                    options={SCHOOL_SUBJECTS}
                    selectedOptions={selectedSubject}
                    setSelectedOptions={setSelectedSubject}
                    optionsContainerScroll={false}
                    optionsContainerHeight={85}
                >
                    <HelperText dynamicStyles={AttendanceStyles.heading}>Fach</HelperText>
                </HelperSelect>

                {/* Date */}
                <HelperView dynamicStyles={AttendanceStyles.inputContainer}>
                    <HelperText dynamicStyles={AttendanceStyles.heading}>Datum (und Zeit? oder Schulstunde?)</HelperText>
                    <DatePicker date={date} setDate={setDate} />
                </HelperView>

                {/* Year */}
                <HelperView dynamicStyles={AttendanceStyles.inputContainer}>
                    <HelperText dynamicStyles={AttendanceStyles.heading}>Jahrgang</HelperText>
                    <HelperInput 
                        placeholder="5 - 13"
                        keyboardType="numeric"
                        containerStyles={AttendanceStyles.defaultHelperInputContainer}
                    />
                </HelperView>

                {/* Topic */}
                <HelperSelect 
                    rendered={selectedSubject === "Musik"}
                    dynamicStyles={AttendanceStyles.inputContainer}
                    options={MUSIC_LESSON_TOPICS}
                    selectedOptions={selectedMusicLessonTopic}
                    setSelectedOptions={setSelectedMusicLessonTopic}
                    optionsContainerScroll={false}
                    optionsContainerHeight={210}
                    style={{zIndex: 2}} // needs to be higher than next sibling
                >
                    <HelperText dynamicStyles={AttendanceStyles.heading}>Stundenthema</HelperText>
                </HelperSelect>

                {/* Examinants */}
                <HelperView dynamicStyles={AttendanceStyles.inputContainer} style={{zIndex: 1/* for select container */}}>
                    <HelperText dynamicStyles={AttendanceStyles.heading} style={{marginBottom: 0}}>Anwesende Prüfer</HelperText>

                    <Flex flexWrap="nowrap">
                        {/* Subjects */}
                        <HelperView dynamicStyles={AttendanceStyles.examinerIconContainer}>
                            <FontAwesome 
                                name={historyExaminantStatus === "checked" ? "user" : "user-o"} 
                                color={HISTORY_COLOR} 
                                style={{...AttendanceStyles.examinerIcon, fontSize: historyExaminantStatus === "checked" ? 35 : 30}}
                                onPress={(e) => setHistoryExaminantStatus(historyExaminantStatus === "checked" ? "unchecked" : "checked")}
                            />
                        </HelperView>

                        <HelperView dynamicStyles={AttendanceStyles.examinerIconContainer}>
                            <FontAwesome 
                                name={musicExaminantStatus === "checked" ? "user" : "user-o"}
                                color={MUSIC_COLOR}
                                style={{...AttendanceStyles.examinerIcon, fontSize: musicExaminantStatus === "checked" ? 35 : 30}}
                                onPress={(e) => setMusicExaminantStatus(musicExaminantStatus === "checked" ? "unchecked" : "checked")}
                            />
                        </HelperView>

                        <HelperView dynamicStyles={AttendanceStyles.examinerIconContainer}>
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
                            dynamicStyles={AttendanceStyles.examinerIconContainer}
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
                <Flex justifyContent="center" dynamicStyles={AttendanceStyles.notesContainer}>
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
                    <HelperView dynamicStyles={AttendanceStyles.inputContainer}>
                        <HelperInput 
                            multiline
                            numberOfLines={numHelperInputLines}
                            placeholder="Thema"
                            dynamicStyles={AttendanceStyles.defaultMultilineHelperInput}
                        />
                    </HelperView>

                    {/* Note2 */}
                    <HelperView dynamicStyles={AttendanceStyles.inputContainer}>
                        <HelperInput 
                            multiline
                            numberOfLines={numHelperInputLines}
                            placeholder="Lerngruppe"
                            dynamicStyles={AttendanceStyles.defaultMultilineHelperInput}
                        />
                    </HelperView>

                    {/* Own/Other class */}
                    <HelperView dynamicStyles={AttendanceStyles.inputContainer}>
                        <RadioButton.Group value={schoolclassMode} onValueChange={(mode) => setSchoolclassMode(mode as SchoolclassMode)}>
                            {schoolclassModeRadioButtons}
                        </RadioButton.Group>

                        <HelperInput
                            placeholder="Ausbildungslehrer"
                            rendered={schoolclassMode === "Ausbildungsunterricht"}
                            dynamicStyles={AttendanceStyles.defaultHelperInputContainer}
                        />
                    </HelperView>
                </HelperView>
            </HelperScrollView>
        </SafeAreaView>
    )
}
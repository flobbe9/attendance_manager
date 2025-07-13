import { DynamicStyle } from "@/abstract/DynamicStyle";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import "@/assets/styles/AttendanceStyles.ts";
import HelperStyles from "@/assets/styles/helperStyles";
import { AttendanceEntity } from "@/backend/DbSchema";
import { AttendanceService } from "@/backend/services/AttendanceService";
import ExaminantInput from "@/components/(attendance)/ExaminantInput";
import SchoolclassModeInput from "@/components/(attendance)/SchoolclassModeInput";
import SchoolSubjectInput from "@/components/(attendance)/SchoolSubjectInput";
import SchoolYearInput from "@/components/(attendance)/SchoolYearInput";
import TopBar from "@/components/(attendance)/TopBar";
import TopicInput from "@/components/(attendance)/TopicInput";
import { AttendanceContext } from "@/components/context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { DontLeaveScreenOptions, useScreenLeaveAttempt } from "@/hooks/useScreenLeaveAttempt";
import { useSubjectColor } from "@/hooks/useSubjectColor";
import { logDebug } from "@/utils/logUtils";
import { BORDER_RADIUS, FONT_SIZE } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewStyle } from "react-native";
import { Divider } from "react-native-paper";
import DateInput from './../../components/(attendance)/DateInput';
import B from "@/components/helpers/B";
import Br from "@/components/helpers/Br";
import P from "@/components/helpers/P";
import HelperCheckbox from "@/components/helpers/HelperCheckbox";
import { SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE } from "@/utils/constants";
import { useNavigation } from "expo-router";
import { DontConfirmAttendanceLeaveContent } from "@/components/(attendance)/DontConfirmAttendanceLeaveContent";
import { useDontShowAgainStates } from "@/hooks/useDontShowAgainStates";


/**
 * Attendance create / edit screen.
 * 
 * @since 0.0.1
 */
export default function index() {
    const { hideSnackbar, toast } = useContext(GlobalContext);
    const { 
        currentAttendanceEntityId, 
        savedAttendanceEntities, 
        dontConfirmAttendanceScreenLeave,
        setDontConfirmAttendanceScreenLeave
    } = useContext(GlobalAttendanceContext);

    const { 
        currentAttendanceEntity, 
        setCurrentAttendanceEntity, 
        updateCurrentAttendanceEntity, 
        lastSavedAttendanceEntity,
        updateLastSavedAttendanceEntity,
        isCurrentAttendanceEntityModified,
        setCurrentAttendanceEntityModified,
    } = useContext(AttendanceContext);
    
    const { transparentColor: subjectColor} = useSubjectColor(currentAttendanceEntity?.schoolSubject, "rgb(240, 240, 240)");

    const [areNotesVisible, setAreNotesVisible] = useState(false);

    const { setDidConfirm, setDidDismiss } = useDontShowAgainStates([dontConfirmAttendanceScreenLeave, setDontConfirmAttendanceScreenLeave], SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE);

    const { allStyles: {mb_2}} = useResponsiveStyles();

    const { animatedStyle: animatedArrowIconRotation } = useAnimatedStyle(
        [0, 180],
        ["0deg", "-180deg"],
        {
            reverse: !areNotesVisible,
        }
    )

    const numHelperInputLines = 20;
    const attendanceService = new AttendanceService();

    const navigation = useNavigation();
        
    useEffect(() => {
        updateLastSavedAttendanceEntity(initializeCurrentAttendanceEntity());
    }, []);

    useScreenLeaveAttempt(
        isCurrentAttendanceEntityModified && !dontConfirmAttendanceScreenLeave, 
        {
            handleScreenLeave: handleScreenLeave,
            handleDontLeaveScreen: handleDontLeaveScreenLeave
        }
    )
    
    useEffect(() => {
        // case: last saved instance has been instantiated
        if (lastSavedAttendanceEntity && currentAttendanceEntity)
            setCurrentAttendanceEntityModified(attendanceService.isModified(lastSavedAttendanceEntity, currentAttendanceEntity));

    }, [currentAttendanceEntity, lastSavedAttendanceEntity]);

    // case: no currentAttendanceEntity yet, should not happen though
    if (!currentAttendanceEntity)
        return (
            <ScreenWrapper
                style={{...AttendanceStyles.suspenseContainer}}
                contentContainerStyle={{...HelperStyles.centerNoFlex}}
            >
                <FontAwesome name="hourglass" size={FONT_SIZE} style={{...mb_2}} />
                <HelperText>Lade Unterrichtsbesuch...</HelperText>
            </ScreenWrapper>
        );

    function handleScreenLeave(): void {
        hideSnackbar();
    }

    function handleDontLeaveScreenLeave(options: DontLeaveScreenOptions): void {
        const handleConfirm = () => 
            navigation.dispatch(options.data.action)

        if (!dontConfirmAttendanceScreenLeave) {
            toast(
                <DontConfirmAttendanceLeaveContent />,
                {
                    onConfirm: () => {
                        setDidConfirm(true);
                        setTimeout(() => {
                            handleConfirm();
                        }, 200); // wait for confirm hook to trigger
                    },
                    onDismiss: () => setDidDismiss(true)
                }
            );
        }
    }

    function initializeCurrentAttendanceEntity(): AttendanceEntity | null {
        let attendanceEntityForId: AttendanceEntity;

        if (currentAttendanceEntityId <= 0)
            attendanceEntityForId = AttendanceService.getEmptyInstance()
            
        else
            attendanceEntityForId = savedAttendanceEntities
               .find(attendanceEntity => attendanceEntity.id === currentAttendanceEntityId);

        if (!attendanceEntityForId) {
            logDebug("Failed to load current attendance entity for current id " + currentAttendanceEntityId);
            return null;
        }

        setCurrentAttendanceEntity(attendanceEntityForId);

        return attendanceEntityForId;
    }


    // TODO: 
        // clean up inline styles
        // screen leave
            // confirm leave if unsaved changes
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
        // on change
            // validate
            // if valid
                // update modified
                    // compare all input values to last saved


    return (
        <ScreenWrapper 
            style={{
                ...AttendanceStyles.component.default,
                backgroundColor: subjectColor, 
            }} 
        >
            <TopBar />
            
            <Divider style={{...mb_2}} />

            <HelperScrollView dynamicStyle={AttendanceStyles.scrollView}>
                <SchoolSubjectInput dynamicStyle={AttendanceStyles.inputContainer} />

                {/* Post select subject */}
                <HelperView rendered={!!currentAttendanceEntity.schoolSubject}>
                    <DateInput dynamicStyle={AttendanceStyles.inputContainer} />

                    <SchoolYearInput dynamicStyle={AttendanceStyles.inputContainer} />

                    <TopicInput 
                        dynamicStyle={AttendanceStyles.inputContainer}
                        style={{zIndex: 2}} // needs to be higher than next sibling
                    />

                    <ExaminantInput 
                        dynamicStyle={AttendanceStyles.inputContainer} 
                        style={{zIndex: 1}} // for select container
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
                                setValue={(value) => updateCurrentAttendanceEntity(["note", value])}
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
                                setValue={(value) => updateCurrentAttendanceEntity(["note2", value])}
                            />
                        </HelperView>

                        <SchoolclassModeInput dynamicStyle={AttendanceStyles.inputContainer} />
                    </HelperView>
                </HelperView>
            </HelperScrollView>
        </ScreenWrapper>
    )
}
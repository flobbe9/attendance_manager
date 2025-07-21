import "@/assets/styles/AttendanceIndexStyles";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import { AttendanceEntity } from "@/backend/DbSchema";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { DontConfirmAttendanceLeaveContent } from "@/components/(attendance)/DontConfirmAttendanceLeaveContent";
import ExaminantInput from "@/components/(attendance)/ExaminantInput";
import NotesInputs from "@/components/(attendance)/NotesInputs";
import SchoolSubjectInput from "@/components/(attendance)/SchoolSubjectInput";
import SchoolYearInput from "@/components/(attendance)/SchoolYearInput";
import TopBar from "@/components/(attendance)/TopBar";
import TopicInput from "@/components/(attendance)/TopicInput";
import { AttendanceContext } from "@/components/context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useDontShowAgainStates } from "@/hooks/useDontShowAgainStates";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { DontLeaveScreenOptions, useScreenLeaveAttempt } from "@/hooks/useScreenLeaveAttempt";
import { useSubjectColor } from "@/hooks/useSubjectColor";
import { SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE } from "@/utils/constants";
import { logDebug } from "@/utils/logUtils";
import { FONT_SIZE } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect } from "react";
import { Divider } from "react-native-paper";
import DateInput from '../../components/(attendance)/DateInput';

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

    const { setDidConfirm, setDidDismiss } = useDontShowAgainStates([dontConfirmAttendanceScreenLeave, setDontConfirmAttendanceScreenLeave], SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE);

    const { allStyles: {mb_2}} = useResponsiveStyles();

    // const { animatedStyle: animatedArrowIconRotation } = useAnimatedStyle(
    //     [0, 180],
    //     ["0deg", "-180deg"],
    //     {
    //         reverse: !areNotesVisible,
    //     }
    // )

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
                style={{...AttendanceIndexStyles.suspenseContainer}}
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

    return (
        <ScreenWrapper 
            style={{
                ...AttendanceIndexStyles.component.default,
                backgroundColor: subjectColor, 
            }} 
        >
            <HelperScrollView 
                stickyHeaderIndices={[0]}
                dynamicStyle={AttendanceIndexStyles.scrollView}
            >
                <HelperView 
                    dynamicStyle={AttendanceIndexStyles.topBarContainer}
                    style={{
                        backgroundColor: subjectColor
                    }}
                >
                    <TopBar />
                    
                    <Divider style={{...mb_2}} />
                </HelperView>

                <SchoolSubjectInput dynamicStyle={AttendanceIndexStyles.inputContainer} />

                {/* Post select subject */}
                <HelperView rendered={!!currentAttendanceEntity.schoolSubject}>
                    <DateInput dynamicStyle={AttendanceIndexStyles.inputContainer} />

                    <SchoolYearInput dynamicStyle={AttendanceIndexStyles.inputContainer} />

                    <TopicInput 
                        rendered={currentAttendanceEntity.schoolSubject === "music"}
                        dynamicStyle={AttendanceIndexStyles.inputContainer}
                        style={{zIndex: 2}} // needs to be higher than next sibling
                    />

                    <ExaminantInput 
                        dynamicStyle={AttendanceIndexStyles.inputContainer} 
                        style={{zIndex: 1}} // for select container
                    />

                    <Divider style={{...mb_2}} />

                    <NotesInputs />
                </HelperView>
            </HelperScrollView>
        </ScreenWrapper>
    )
}
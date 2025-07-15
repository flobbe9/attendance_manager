import { PopupsStyles } from "@/assets/styles/PopupsStyles";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE, SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY, SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY } from "@/utils/constants";
import React, { useState } from "react";
import BooleanSetting from "./BooleanSetting";

/**
 * @since latest
 */
export default function popups() {
    const isShowErrorPopupState = useState(false);
    const isConfirmSubjectChangeState = useState(false);
    const isConfirmAttendanceLeaveState = useState(false);

    const { allStyles: { mb_3 } } = useResponsiveStyles();

    return (
        <ScreenWrapper>
            <HelperScrollView dynamicStyle={PopupsStyles.component}>
                <BooleanSetting 
                    heading="Ungültiger UB Wert"
                    explanation="Ein erklärender Hinweis wird angezeigt, wenn ein ungültiger UB Wert eingeben wird."
                    settingsState={isShowErrorPopupState}
                    settingsKey={SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY}
                    invertDbValue
                    style={{...mb_3}}
                />

                <BooleanSetting 
                    heading="UB Fach ändern"
                    explanation="Ein Bestätigungs-popup wird angezeigt bevor das UB Fach gewechselt wird, weil einige UB Werte dabei zurückgesetzt werden."
                    settingsState={isConfirmSubjectChangeState}
                    settingsKey={SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY}
                    invertDbValue
                    style={{...mb_3}}
                />

                <BooleanSetting 
                    heading="UB ohne speichern verlassen"
                    explanation="Ein Bestätigungs-popup wird vor dem Verlassen des UB Bearbeitungs-screens angezeigt, wenn es ungespeicherte Änderungen gibt."
                    settingsState={isConfirmAttendanceLeaveState}
                    settingsKey={SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE}
                    invertDbValue
                    style={{...mb_3}}
                />
            </HelperScrollView>
        </ScreenWrapper>
    )
}
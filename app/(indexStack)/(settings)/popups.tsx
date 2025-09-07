import { PopupsStyles } from "@/assets/styles/PopupsStyles";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import React, { useContext, useState } from "react";
import BooleanSetting from "./BooleanSetting";

/**
 * @since 0.1.0
 */
export default function popups() {
    const isShowErrorPopupState = useState(false);
    const isConfirmSubjectChangeState = useState(false);
    const isConfirmAttendanceLeaveState = useState(false);

    const { prs } = useContext(GlobalContext);

    return (
        <ScreenWrapper>
            <HelperScrollView dynamicStyle={PopupsStyles.component}>
                <BooleanSetting
                    heading="Ungültiger UB Wert"
                    explanation="Ein erklärender Hinweis wird angezeigt, wenn ein ungültiger UB Wert eingeben wird."
                    settingsState={isShowErrorPopupState}
                    settingsKey={"popups.dontShowAttendanceInputValidationErrorPopup"}
                    invertDbValue
                    style={{...prs("mb_3")}}
                />

                <BooleanSetting
                    heading="UB Fach ändern"
                    explanation="Ein Bestätigungspopup wird angezeigt, bevor das UB Fach gewechselt wird, weil einige UB Werte dabei zurückgesetzt werden."
                    settingsState={isConfirmSubjectChangeState}
                    settingsKey={"popups.dontConfirmSchoolSubjectChnage"}
                    invertDbValue
                    style={{...prs("mb_3")}}
                />

                <BooleanSetting
                    heading="UB ohne speichern verlassen"
                    explanation="Ein Bestätigungspopup wird vor dem Verlassen des UB Bearbeitungsscreens angezeigt, wenn es ungespeicherte Änderungen gibt."
                    settingsState={isConfirmAttendanceLeaveState}
                    settingsKey={"popups.dontConfirmAttendanceScreenLeave"}
                    invertDbValue
                    style={{...prs("mb_3")}}
                />
            </HelperScrollView>
        </ScreenWrapper>
    );
}

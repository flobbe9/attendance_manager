import { AppTestingIndexStyles } from "@/assets/styles/AppTestingIndexStyles";
import { SettingsStyles } from "@/assets/styles/SettingsStyles";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import B from "@/components/helpers/B";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import P from "@/components/helpers/P";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useFileLogger } from "@/hooks/useFileLogger";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";

export default function index() {
    const { shareLogFiles, isFileLoggerEnabled } = useFileLogger();

    const { prs } = useContext(GlobalContext);

    return (
        <ScreenWrapper style={{padding: GLOBAL_SCREEN_PADDING}}>
            <B dynamicStyle={SettingsStyles.heading}>Logs senden {isFileLoggerEnabled() ? "" : "(deaktiviert)"}</B>

            <HelperView rendered={isFileLoggerEnabled()}>
                <HelperButton
                    rendered={isFileLoggerEnabled()}
                    onPress={shareLogFiles}
                    >
                    <FontAwesome name="share" style={{...prs("me_2"), ...AppTestingIndexStyles.buttonContent.default}} />
                    <HelperText dynamicStyle={AppTestingIndexStyles.buttonContent}>Logs senden</HelperText>
                </HelperButton>

                <P>Sende die App Logs der letzten 5 Tage zur Fehleranalyse an den Entwickler.</P>
            </HelperView>
        </ScreenWrapper>
    )
}
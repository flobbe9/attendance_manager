import { AppTestingIndexStyles } from "@/assets/styles/AppTestingIndexStyles";
import HelperButton from "@/components/helpers/HelperButton";
import HelperText from "@/components/helpers/HelperText";
import P from "@/components/helpers/P";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useFileLogger } from "@/hooks/useFileLogger";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";

export default function index() {
    const { shareLogFiles, isFileLoggerEnabled } = useFileLogger();

    const { prs } = useResponsiveStyles();

    return (
        <ScreenWrapper style={{padding: GLOBAL_SCREEN_PADDING}}>
            <HelperButton
                rendered={isFileLoggerEnabled()}
                onPress={shareLogFiles}
            >
                <FontAwesome name="share" style={{...prs("me_2"), ...AppTestingIndexStyles.buttonContent.default}} />
                <HelperText dynamicStyle={AppTestingIndexStyles.buttonContent}>Logs senden</HelperText>
            </HelperButton>

            <P>Sende die App Logs der letzten 5 Tage zur Fehleranalyse an den Entwickler.</P>
        </ScreenWrapper>
    )
}
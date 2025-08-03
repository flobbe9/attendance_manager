import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { SettingsIndexStyles } from "@/assets/styles/SettingsIndexStyles";
import AttendanceInputErrorPopupIcon from "@/components/(attendance)/AttendanceInputErrorPopupIcon";
import B from "@/components/helpers/B";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { FONT_SIZE_LARGER } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { ReactNode } from "react";

/**
 * @since 0.1.0
 */
export default function index() {
    const {
        allStyles: { me_2 },
    } = useResponsiveStyles();

    function SetttingsLink(props: { href: Href; label: string; icon: FontAweSomeIconname | ReactNode }) {
        const { href, label, icon } = props;

        return (
            <Link href={href} asChild>
                <HelperButton dynamicStyle={SettingsIndexStyles.settingsItemButton} containerStyles={SettingsIndexStyles.settingsItemButtonContainer}>
                    {typeof icon === "string" ? (
                        <FontAwesome name={icon as FontAweSomeIconname} style={{ ...SettingsIndexStyles.settingsItemText, ...me_2 }} />
                    ) : (
                        icon
                    )}
                    <B style={{ ...SettingsIndexStyles.settingsItemText }}>{label}</B>
                </HelperButton>
            </Link>
        );
    }

    return (
        <ScreenWrapper>
            <HelperScrollView dynamicStyle={SettingsIndexStyles.component}>
                {/* <SetttingsLink href="/(settings)/account" icon="user-circle-o" label="Konto" /> */}
                {/* <SetttingsLink href="/(settings)/popups" icon="paint-brush" label="Farben und Styles" /> */}
                <SetttingsLink
                    href="/(settings)/popups"
                    icon={<AttendanceInputErrorPopupIcon style={{ ...SettingsIndexStyles.settingsItemText, ...me_2 }} color="black" />}
                    label="Popup Präferenzen"
                />

                <SetttingsLink
                    href="/(settings)/appInfo"
                    icon={<FontAwesome name="info" style={{ ...SettingsIndexStyles.settingsItemText, ...me_2 }} />}
                    label="Über die App"
                />
            </HelperScrollView>
        </ScreenWrapper>
    );
}

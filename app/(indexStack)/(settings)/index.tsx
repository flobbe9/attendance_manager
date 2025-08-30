import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { SettingsIndexStyles } from "@/assets/styles/SettingsIndexStyles";
import AttendanceInputErrorPopupIcon from "@/components/(attendance)/AttendanceInputErrorPopupIcon";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import B from "@/components/helpers/B";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { ReactNode, useContext } from "react";

/**
 * @since 0.1.0
 */
export default function index() {
    const { prs } = useContext(GlobalContext);

    function SetttingsLink(props: { href: Href; label: string; icon: FontAweSomeIconname | ReactNode }) {
        const { href, label, icon } = props;

        return (
           <Link href={href} asChild>
                <HelperButton dynamicStyle={SettingsIndexStyles.settingsItemButton} containerStyles={SettingsIndexStyles.settingsItemButtonContainer}>
                    {typeof icon === "string" ? (
                        <FontAwesome name={icon as FontAweSomeIconname} style={{ ...SettingsIndexStyles.settingsItemText, ...prs("me_2") }} />
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
                <SetttingsLink
                    href="/(indexStack)/(settings)/popups"
                    icon={<AttendanceInputErrorPopupIcon style={{ ...SettingsIndexStyles.settingsItemText, ...prs("me_2") }} color="black" />}
                    label="Popup Präferenzen"
                />

                <SetttingsLink 
                    href="/(indexStack)/(settings)/backup"
                    icon={<FontAwesome5 name="sync" style={{ ...SettingsIndexStyles.settingsItemText, ...prs("me_2") }} />}
                    label="Backup"
                />

                <SetttingsLink
                    href="/(indexStack)/(settings)/appInfo"
                    icon={<FontAwesome name="info" style={{ ...SettingsIndexStyles.settingsItemText, ...prs("ms_1", "me_3") }} />}
                    label="Über diese App"
                />
            </HelperScrollView>
        </ScreenWrapper>
    );
}

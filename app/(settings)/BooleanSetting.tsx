import HelperProps from "@/abstract/HelperProps";
import { BooleanSettingStyles } from "@/assets/styles/BooleanSettingStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import { MetadataKey } from "@/backend/abstract/MetadataKey";
import B from "@/components/helpers/B";
import Flex from "@/components/helpers/Flex";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useMetadataRepository } from "@/hooks/repositories/useMetadataRepository";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";
import { useHelperProps } from "@/hooks/useHelperProps";
import { logTrace } from "@/utils/logUtils";
import { useEffect } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { Switch } from "react-native-paper";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    heading: string;
    explanation: string;
    settingsState: [boolean, (turnedOn: boolean) => void];
    settingsKey: MetadataKey;
    /** Whether to save a `true` state as "false". Default is `false` */
    invertDbValue?: boolean;
}

/**
 * @since 0.1.0
 */
export default function BooleanSetting({
    heading,
    explanation,
    settingsState,
    settingsKey,
    invertDbValue = false,
    ...props
}: Props) {
    const componentName = "BooleanSetting";
    const {children, ...otherProps} = useHelperProps(
        props,
        componentName,
        BooleanSettingStyles.component
    );

    const { metadataRepository } = useMetadataRepository();

    const [settingTurnedOn, setSettingTurnedOn] = settingsState;

    const mounted = useHasComponentMounted();

    useEffect(() => {
        initializeSetting();
    }, []);

    useEffect(() => {
        if (mounted) updateSetting();
    }, [settingTurnedOn]);

    async function initializeSetting(): Promise<void> {
        const dbResult = await metadataRepository.selectByKeyParseBoolean(settingsKey);
        setSettingTurnedOn(!invertDbValue ? dbResult : !dbResult);
    }

    async function updateSetting(): Promise<void> {
        const value = invertDbValue ? !settingTurnedOn : settingTurnedOn;
        await metadataRepository.persistByKey(settingsKey, value ? "true" : "false");
        logTrace("udpated setting", settingsKey, value);
    }

    return (
        <HelperView {...otherProps}>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                style={{...HelperStyles.fullWidth}}
            >
                <B dynamicStyle={BooleanSettingStyles.heading}>{heading}</B>

                <Switch
                    value={settingTurnedOn}
                    onValueChange={setSettingTurnedOn}
                    color="rgb(50, 200, 100)"
                />
            </Flex>

            <HelperText>{explanation}</HelperText>

            {children}
        </HelperView>
    );
}

import HelperProps from "@/abstract/HelperProps";
import { BooleanSettingStyles } from "@/assets/styles/BooleanSettingStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import { PopupsStyles } from "@/assets/styles/PopupsStyles";
import B from "@/components/helpers/B";
import Flex from "@/components/helpers/Flex";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useSettingsRepository } from "@/hooks/repositories/useSettingsRepository";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { logTrace } from "@/utils/logUtils";
import { useState, useEffect } from "react";
import { ViewStyle, ViewProps } from "react-native";
import { Switch } from "react-native-paper";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    heading: string, 
    explanation: string, 
    settingsState: [boolean, (turnedOn: boolean) => void],
    settingsKey: string,
    /** Whether to save a `true` state as "false". Default is `false` */
    invertDbValue?: boolean
}

/**
 * @since latest
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
    const { children, ...otherProps } = useHelperProps(props, componentName, BooleanSettingStyles.component);
    
    const { settingsRepository } = useSettingsRepository();

    const [settingTurnedOn, setSettingTurnedOn] = settingsState;
    
    const mounted = useHasComponentMounted();
    
    useEffect(() => {
        initializeSetting();
    }, []);

    useEffect(() => {
        if (mounted)
            updateSetting();
    }, [settingTurnedOn]);
    
    async function initializeSetting(): Promise<void> {
        const dbResult = await settingsRepository.loadBooleanSetting(settingsKey);
        setSettingTurnedOn(!invertDbValue ? dbResult : !dbResult);
    }
    
    async function updateSetting(): Promise<void> {
        const value = invertDbValue ? !settingTurnedOn : settingTurnedOn;
        await settingsRepository.updateValue(settingsKey, value ? "true" : "false");
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

            <HelperText>
                {explanation}
            </HelperText>

            {children}
        </HelperView>
    )
}
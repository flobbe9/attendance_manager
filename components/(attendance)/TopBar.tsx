import HelperProps from "@/abstract/HelperProps";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { TopBarStyles } from "@/assets/styles/TopBarStyles";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Flex from "../helpers/Flex";
import HelperButton from "../helpers/HelperButton";
import HelperText from "../helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import { Button } from "react-native-paper";
import { sleep } from "@/utils/utils";
import { log } from "@/utils/logUtils";
import { AttendanceContext } from "../context/AttendanceContextProvider";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function TopBar({...props}: Props) {

    const { allStyles: { pe_2 }, parseResponsiveStyleToStyle: pr } = useResponsiveStyles();
    const { currentAttendanceEntity, setCurrentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { modified } = useContext(AttendanceContext);
    
    const { attendanceRespository } = useAttendanceRepository();

    const componentName = "TopBar";
    const { children, ...otherProps } = useHelperProps(props, componentName, TopBarStyles.component);

    
    async function handleSavePress(): Promise<void> {

        // validate empty values

        // validate all logic?

        // if invalid
            // notify

        // else
            // persist cascade
            // notify
            // notify db error, add instructions
            // update state
            // set last saved to current (should set modifed to false automatically)
    }

    // save button
        // disabled while not modified
        // loading animation if takes longer

    return (
        <Flex justifyContent="flex-end" {...otherProps}>
            {/* Save button */}
            <HelperButton dynamicStyle={TopBarStyles.saveButton} onPress={handleSavePress} disabled={!modified}> 
                <FontAwesome 
                    name="save"
                    style={{
                        ...TopBarStyles.saveButtonChildren.default, 
                        ...pr({pe_2})
                    }} 
                />
                <HelperText dynamicStyle={TopBarStyles.saveButtonChildren}>Save</HelperText>
            </HelperButton>
        </Flex>
    )
}
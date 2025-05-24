import HelperProps from "@/abstract/HelperProps";
import { getSchoolclassModeBySchoolclassModeKey, getSchoolclassModeKeyBySchoolclassMode, SCHOOLCLASS_MODES, SchoolclassMode } from "@/abstract/SchoolclassMode";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";
import HelperInput from "../helpers/HelperInput";
import { AttendanceContext } from "../context/AttendanceContextProvider";
;
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperText from "../helpers/HelperText";
import HelperStyles from "@/assets/styles/helperStyles";
import { SchoolclassModeEntity } from "@/backend/DbSchema";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import { DynamicStyle } from "@/abstract/DynamicStyle";
import { log } from "@/utils/logUtils";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolclassModeInput({...props}: Props) {

    const { currentAttendanceEntity } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const [schoolclassModeRadioButtons, setSchoolclassModeRadioButtons] = useState<JSX.Element[]>([]); 

    const componentName = "SchoolclassModeInput";
    const { children, ...otherProps } = useHelperProps(props, componentName);


    useEffect(() => {
        setSchoolclassModeRadioButtons(mapSchoolclassModeRadioButtons());

    }, []);
        
        
    function mapSchoolclassModeRadioButtons(): JSX.Element[] {

        return SCHOOLCLASS_MODES.map((mode, i) => (
            <Flex alignItems="center" key={i} flexWrap="nowrap">
                <RadioButton.IOS value={mode} />

                <HelperText
                    style={HelperStyles.fullWidth}
                    onPress={() => updateSchoolclassMode(mode)}
                >
                    {mode}
                </HelperText>
            </Flex>
        ));
    }


    function updateSchoolclassMode(mode: SchoolclassMode): void {

        updateCurrentAttendanceEntity<SchoolclassModeEntity>("schoolclassMode", {
            mode: getSchoolclassModeKeyBySchoolclassMode(mode)
        });
    }


    function updateSchoolclassModeNote(fullName: string): void {

        updateCurrentAttendanceEntity<SchoolclassModeEntity>("schoolclassMode", {
            ...currentAttendanceEntity.schoolclassMode,
            fullName
        })
    }


    return (
        <HelperView {...otherProps}>
            <RadioButton.Group 
                value={getSchoolclassModeBySchoolclassModeKey(currentAttendanceEntity.schoolclassMode.mode)} 
                onValueChange={updateSchoolclassMode}
            >
                {schoolclassModeRadioButtons}
            </RadioButton.Group>

            <HelperInput
                placeholder="Ausbildungslehrer"
                rendered={currentAttendanceEntity.schoolclassMode.mode === "othersClass"}
                containerStyles={AttendanceStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                onChangeText={(value) => updateSchoolclassModeNote(value)}
            />
        </HelperView>
    )
}
import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { getSchoolclassModeBySchoolclassModeKey, getSchoolclassModeKeyBySchoolclassMode, SCHOOLCLASS_MODES, SchoolclassMode } from "@/abstract/SchoolclassMode";
import { AttendanceStyles } from "@/assets/styles/AttendanceStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import { SchoolclassModeEntity } from "@/backend/DbSchema";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { RadioButton } from "react-native-paper";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperInput from "../helpers/HelperInput";
import HelperText from "../helpers/HelperText";
;


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function SchoolclassModeInput({...props}: Props) {
    const { updateCurrentAttendanceEntity, currentAttendanceEntity } = useContext(AttendanceContext);

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
        updateCurrentAttendanceEntity<SchoolclassModeEntity>([
            "schoolclassMode", 
            {
                mode: getSchoolclassModeKeyBySchoolclassMode(mode),
                fullName: currentAttendanceEntity.schoolclassMode.fullName // keep the name for state
            }
        ]);
    }

    function updateSchoolclassModeNote(fullName: string): void {
        updateCurrentAttendanceEntity<SchoolclassModeEntity>([
            "schoolclassMode", 
            {
                ...currentAttendanceEntity.schoolclassMode,
                fullName
            }
        ])
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
                value={currentAttendanceEntity.schoolclassMode.fullName}
                onChangeText={updateSchoolclassModeNote}
            />
        </HelperView>
    )
}
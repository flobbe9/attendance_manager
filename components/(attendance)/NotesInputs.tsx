import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import HelperInput from "../helpers/HelperInput";
import HelperText from "../helpers/HelperText";
import HelperView from "../helpers/HelperView";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.2.2
 */
export default function NotesInputs({ ...props }: Props) {
    const { currentAttendanceEntity, updateCurrentAttendanceEntity } = useContext(AttendanceContext);

    const componentName = "NotesInputs";
    const { children, ...otherProps } = useHelperProps(props, componentName);

    const numHelperInputLines = 20;

    return (
        <HelperView {...otherProps}>
            <HelperText dynamicStyle={AttendanceIndexStyles.heading}>Notitzen</HelperText>

            {/* Note */}
            <HelperView dynamicStyle={AttendanceIndexStyles.inputContainer}>
                <HelperInput
                    placeholder="Thema"
                    multiline
                    numberOfLines={numHelperInputLines}
                    dynamicStyle={AttendanceIndexStyles.defaultMultilineHelperInput}
                    containerStyles={AttendanceIndexStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                    value={currentAttendanceEntity.note}
                    setValue={(value) => updateCurrentAttendanceEntity(["note", value])}
                />
            </HelperView>

            {/* Note2 */}
            <HelperView dynamicStyle={AttendanceIndexStyles.inputContainer}>
                <HelperInput
                    placeholder="Lerngruppe"
                    multiline
                    numberOfLines={numHelperInputLines}
                    dynamicStyle={AttendanceIndexStyles.defaultMultilineHelperInput}
                    containerStyles={AttendanceIndexStyles.defaultHelperInputContainer as DynamicStyle<ViewStyle>}
                    value={currentAttendanceEntity.note2}
                    setValue={(value) => updateCurrentAttendanceEntity(["note2", value])}
                />
            </HelperView>
        </HelperView>
    );
}

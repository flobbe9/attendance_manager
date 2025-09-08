import { ExaminantRole_Key, getExamiantRoleByExaminantRoleKey } from "@/abstract/Examinant";
import { Headmaster, HEADMASTERS } from "@/abstract/Headmaster";
import HelperProps from "@/abstract/HelperProps";
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { ExaminantInputStyles } from "@/assets/styles/ExaminantInputStyles";
import { ExaminantEntity } from "@/backend/entities/ExaminantEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { ExaminantService } from "@/backend/services/ExaminantService";
import { AttendanceInputValidatorBuilder } from "@/backend/validator/AttendanceInputValidatorBuilder";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { getSubjectColor } from "@/hooks/useSubjectColor";
import { CheckboxStatus, NO_SELECTION_LABEL } from "@/utils/constants";
import { cloneObj, isBlank } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AttendanceContext } from "../context/AttendanceContextProvider";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import Flex from "../helpers/Flex";
import HelperCheckbox from "../helpers/HelperCheckbox";
import HelperSelect from "../helpers/HelperSelect";
import HelperText from "../helpers/HelperText";
import AttendanceInputTooltip from "./AttendanceInputTooltip";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

/**
 * @since 0.0.1
 */
export default function ExaminantInput({ ...props }: Props) {
    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);
    const { updateCurrentAttendanceEntity, currentAttendanceEntity, handleInvalidAttendanceInput } = useContext(AttendanceContext);

    const [historyExaminantStatus, setHistoryExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    const [musicExaminantStatus, setMusicExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    const [educatorExaminantStatus, setEducatorExaminantStatus] = useState<CheckboxStatus>("indeterminate");
    const [headmasterStatus, setHeadmasterStatus] = useState<CheckboxStatus>("indeterminate");

    const [selectedHeadmaster, setSelectedHeadmaster] = useState<Headmaster | typeof NO_SELECTION_LABEL>();

    /** Indicates that all checkbox states have been initialized with `currentAttendanceEntity` values  */
    const [initializedCheckboxes, setInitializedCheckboxes] = useState(false);

    const [invalidValues, setInvalidValues] = useState<Map<ExaminantEntity[], string>>(new Map());

    const examinantService = new ExaminantService();
    const validator = AttendanceInputValidatorBuilder.builder(currentAttendanceEntity, savedAttendanceEntities).inputType("examinants").build();

    const componentName = "ExaminantInput";
    const { children, ...otherProps } = useHelperProps(props, componentName, ExaminantInputStyles.component);

    const attendanceService = new AttendanceService();

    useEffect(() => {
        const invalidValues = validator.getInvalidValues() as Map<ExaminantEntity[], string>;
        setInvalidValues(invalidValues);
    }, [currentAttendanceEntity]);

    useEffect(() => {
        initializeStates();
    }, [currentAttendanceEntity.schoolSubject]); // on render and subject change, when all examinant statuses are reset

    useEffect(() => {
        // case: states initialized already
        if (initializedCheckboxes) updateCurrentAttendanceEntityExaminants();
    }, [historyExaminantStatus, musicExaminantStatus, educatorExaminantStatus, headmasterStatus, selectedHeadmaster]);

    function initializeStates(): void {
        setHistoryExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "history") ? "checked" : "unchecked");
        setMusicExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "music") ? "checked" : "unchecked");
        setEducatorExaminantStatus(attendanceService.hasExaminant(currentAttendanceEntity, "educator") ? "checked" : "unchecked");

        const [headmasterExaminant] = attendanceService.getExaminantByRole(currentAttendanceEntity, "headmaster");
        setHeadmasterStatus(!!headmasterExaminant ? "checked" : "unchecked");
        setSelectedHeadmaster(headmasterExaminant ? (headmasterExaminant.fullName as Headmaster | null) : NO_SELECTION_LABEL);

        // call this last
        setTimeout(() => {
            setInitializedCheckboxes(true);
        }, 500); // wait for other states to activate useEffect
    }

    function updateCurrentAttendanceEntityExaminants(): void {
        const originalExaminants = cloneObj(currentAttendanceEntity.examinants);

        if (historyExaminantStatus === "checked") attendanceService.addExaminantByRole(currentAttendanceEntity, "history");
        else if (historyExaminantStatus === "unchecked") attendanceService.removeExaminant(currentAttendanceEntity, "history");

        if (musicExaminantStatus === "checked") attendanceService.addExaminantByRole(currentAttendanceEntity, "music");
        else if (musicExaminantStatus === "unchecked") attendanceService.removeExaminant(currentAttendanceEntity, "music");

        if (educatorExaminantStatus === "checked") attendanceService.addExaminantByRole(currentAttendanceEntity, "educator");
        else if (educatorExaminantStatus === "unchecked") attendanceService.removeExaminant(currentAttendanceEntity, "educator");

        if (headmasterStatus === "checked")
            attendanceService.addOrUpdateExaminantByRole(currentAttendanceEntity, {
                role: "headmaster",
                fullName: selectedHeadmaster === NO_SELECTION_LABEL ? null : selectedHeadmaster,
            });
        else if (headmasterStatus === "unchecked") attendanceService.removeExaminant(currentAttendanceEntity, "headmaster");

        const errorMessage = validator.validate(currentAttendanceEntity.examinants);

        if (!isBlank(errorMessage)) {
            handleInvalidAttendanceInput(
                currentAttendanceEntity.examinants
                    .map((examinantEntity) => getExamiantRoleByExaminantRoleKey(examinantEntity.role) as string)
                    .reduce((prev, cur) => `${prev}, ${cur}`),
                errorMessage,
                "examinants"
            );

            // reset entity
            currentAttendanceEntity.examinants = originalExaminants;
            // reset checkboxes
            initializeStates();
        } else updateCurrentAttendanceEntity(["examinants", currentAttendanceEntity.examinants]);
    }

    function CheckboxWithExaminantIcon(props: {
        checkedStatus: CheckboxStatus;
        setCheckedStatus: (status: CheckboxStatus) => void;
        iconName?: string;
        role: ExaminantRole_Key;
        disabled?: boolean;
    }) {
        const { checkedStatus, setCheckedStatus, iconName = "user", role, disabled = false } = props;

        return (
            <HelperView dynamicStyle={ExaminantInputStyles.checkboxContainer}>
                <HelperCheckbox
                    checked={checkedStatus === "checked"}
                    setChecked={(checked) => setCheckedStatus(checked ? "checked" : "unchecked")}
                    dynamicStyle={ExaminantInputStyles.checkbox}
                    iconStyle={ExaminantInputStyles.checkboxIcon}
                    disabled={disabled}
                >
                    <FontAwesome name={iconName as any} color={getSubjectColor(role)} style={{ ...ExaminantInputStyles.icon }} />
                </HelperCheckbox>
            </HelperView>
        );
    }

    function isExaminantInvalid(role: ExaminantRole_Key): boolean {
        if (!invalidValues || !invalidValues.size) return false;

        const flatExaminants = Array.from(invalidValues.keys()).flat();
        return !!examinantService.findExaminant(flatExaminants, role)[0];
    }

    return (
        <HelperView {...otherProps}>
            <Flex alignItems="center" style={{ zIndex: 1 }}>
                <HelperText dynamicStyle={AttendanceIndexStyles.heading} style={{ marginBottom: 0 }}>
                    Anwesende Prüfer
                </HelperText>

                <AttendanceInputTooltip values={invalidValues} attendanceInputKey={"examinants"} validator={validator} />
            </Flex>

            <Flex>
                {/* Subjects */}
                <CheckboxWithExaminantIcon
                    checkedStatus={musicExaminantStatus}
                    setCheckedStatus={setMusicExaminantStatus}
                    role="music"
                    disabled={musicExaminantStatus === "unchecked" && isExaminantInvalid("music")}
                />

                <CheckboxWithExaminantIcon
                    checkedStatus={historyExaminantStatus}
                    setCheckedStatus={setHistoryExaminantStatus}
                    role="history"
                    disabled={historyExaminantStatus === "unchecked" && isExaminantInvalid("history")}
                />

                <CheckboxWithExaminantIcon
                    checkedStatus={educatorExaminantStatus}
                    setCheckedStatus={setEducatorExaminantStatus}
                    role="educator"
                    disabled={educatorExaminantStatus === "unchecked" && isExaminantInvalid("educator")}
                />
            </Flex>

            {/* Headmaster */}
            <Flex alignItems="flex-start" flexShrink={1} style={{ marginTop: 20 }}>
                <CheckboxWithExaminantIcon
                    checkedStatus={headmasterStatus}
                    setCheckedStatus={setHeadmasterStatus}
                    role="headmaster"
                    iconName="graduation-cap"
                />

                <HelperSelect
                    style={{ flexShrink: 1 }}
                    rendered={headmasterStatus === "checked"}
                    options={HEADMASTERS}
                    selectedOptions={selectedHeadmaster}
                    setSelectedOptions={setSelectedHeadmaster}
                    optionsContainerScroll={false}
                    selectionButtonProps={{
                        dynamicStyle: AttendanceIndexStyles.defaultHelperButton,
                        ripple: { rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground },
                        containerStyles: AttendanceIndexStyles.defaultHelperButtonContainer
                    }}
                    optionButtonProps={{
                        ripple: { rippleBackground: AttendanceIndexStyles.defaultHelperButtonRippleBackground },
                    }}
                >
                    <HelperText>Schulleitung</HelperText>
                </HelperSelect>
            </Flex>
        </HelperView>
    );
}

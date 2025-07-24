import { AbstractRepository } from "@/backend/abstract/AbstractRepository";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useDontShowAgainStates } from "@/hooks/useDontShowAgainStates";
import { useFlashState } from "@/hooks/useFlashState";
import {
    ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
    ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR,
    ATTENDANCE_INPUT_TOOLTIP_ICON_FLASH_INTERVAL,
    ATTENDANCE_INPUT_TOOLTIP_ICON_NUM_FLASHES,
} from "@/utils/styleConstants";
import { cloneObj, isAnyFalsy } from "@/utils/utils";
import { createContext, useContext, useState } from "react";
import { ColorValue } from "react-native";
import { ValueOf } from "react-native-gesture-handler/lib/typescript/typeUtils";
import AttendanceInputErrorSnackbarContent from "../(attendance)/AttendanceInputErrorSnackbarContent";
import { CustomSnackbarStatus } from "../CustomSnackbar";
import { GlobalAttendanceContext } from "./GlobalAttendanceContextProvider";
import { GlobalContext } from "./GlobalContextProvider";

/**
 * Context available to all attendance edit sepcific screens of /(attendance).
 *
 * @param children mandatory
 * @since 0.0.1
 */
export default function AttendanceContextProvider({children}) {
    const {snackbar, hideSnackbar} = useContext(GlobalContext);
    const {dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup} =
        useContext(GlobalAttendanceContext);

    /** The attendance entity currently beeing edited. Dont set an initial value */
    const [currentAttendanceEntity, setCurrentAttendanceEntity] = useState<
        AttendanceEntity | undefined
    >();
    /** Expected to be initialized with `currentAttendanceEntity` on attendance screen render */
    const [lastSavedAttendanceEntity, setLastSavedAttendanceEntity] = useState<
        AttendanceEntity | undefined
    >();

    /** Triggered when invalid input error popup is dismissed.  */
    const {setDidConfirm, setDidDismiss} = useDontShowAgainStates(
        [dontShowInvalidInputErrorPopup, setDontShowInvalidInputErrorPopup],
        "popups.dontShowAttendanceInputValidationErrorPopup"
    );

    const {attendanceRespository} = useAttendanceRepository();

    /** Indicates whether `currentAttendanceEntity` has been modified compared to `lastSavedAttendanceEntity` */
    const [modified, setModified] = useState(false);

    /** The attendance entity field name of an input which has last received an invalid value */
    const [currentlyInvalidAttendanceInputKey, setCurrentlyInvalidAttendanceInputKey] = useState<
        keyof AttendanceEntity | undefined
    >();
    const {
        flash: flashTooltipIcon,
        flashOnce: flashTooltipIconOnce,
        currentValue: tooltipIconColor,
        setCurrentValue: setTooltipIconColor,
    } = useFlashState<ColorValue>(
        ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR,
        ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR,
        {
            interval: ATTENDANCE_INPUT_TOOLTIP_ICON_FLASH_INTERVAL,
            numFlashes: ATTENDANCE_INPUT_TOOLTIP_ICON_NUM_FLASHES,
        }
    );

    const context = {
        updateCurrentAttendanceEntity,

        currentAttendanceEntity,
        setCurrentAttendanceEntity,
        lastSavedAttendanceEntity,
        updateLastSavedAttendanceEntity,

        isCurrentAttendanceEntityModified: modified,
        setCurrentAttendanceEntityModified: setModified,

        handleInvalidAttendanceInput,
        resetInvalidAttendanceInputErrorStyles,

        tooltipIconColor,
        setTooltipIconColor,
        currentlyInvalidAttendanceInputKey,
    };

    /**
     * Prepare value of `attendancEntityKey` for `currentAttendanceEntity`.
     *
     * If `value` is an object also set the backreference assuming `getBackReferenceColumnName`.
     *
     * @param attendancEntityValue the input value, any value of attendance entity props
     */
    function prepareCurrentAttendanceEntityUpdate<T extends ValueOf<AttendanceEntity>>(
        attendancEntityValue: T
    ): T {
        // make sure to set the backreference
        if (!isAnyFalsy(attendancEntityValue) && typeof attendancEntityValue === "object") {
            if (Array.isArray(attendancEntityValue))
                attendancEntityValue.forEach((ownedEntity) => {
                    if (!isAnyFalsy(ownedEntity) && typeof ownedEntity === "object")
                        ownedEntity[attendanceRespository.getBackReferenceColumnName()] =
                            currentAttendanceEntity.id;
                });
            else
                attendancEntityValue[attendanceRespository.getBackReferenceColumnName()] =
                    currentAttendanceEntity.id;
        }

        return attendancEntityValue;
    }

    /**
     * Update the `currentAttendanceEntity` state.
     *
     * Set `undefined` values to `null` in order for db update function to work properly.
     *
     * @param attendanceEntityKey column name of attendance entity
     * @param attendancEntityValue the input value, any value of attendance entity props
     * @see {@link prepareCurrentAttendanceEntityUpdate()}
     */
    function updateCurrentAttendanceEntity<T extends ValueOf<AttendanceEntity>>(
        keyValues: Map<keyof AttendanceEntity, T> | [keyof AttendanceEntity, T]
    ): void {
        if (!keyValues) return;

        let updatedAttendanceEntity: AttendanceEntity = currentAttendanceEntity;

        if (Array.isArray(keyValues)) {
            updatedAttendanceEntity = {
                ...updatedAttendanceEntity,
                [keyValues[0]]: prepareCurrentAttendanceEntityUpdate(keyValues[1]),
            };
        } else if (keyValues instanceof Map) {
            keyValues.forEach(
                (value, key) =>
                    (updatedAttendanceEntity = {
                        ...updatedAttendanceEntity,
                        [key]: prepareCurrentAttendanceEntityUpdate(value),
                    })
            );
        } else throw new Error(`Invalid type of 'keyValues' '${typeof keyValues}'`);

        updatedAttendanceEntity = AbstractRepository.fixEmptyColumnValues(updatedAttendanceEntity);

        setCurrentAttendanceEntity({
            ...updatedAttendanceEntity,
        });
    }

    /**
     * Clones `attendanceEntity`, then updates state.
     *
     * @param attendanceEntity to update the last saved state with.
     */
    function updateLastSavedAttendanceEntity(attendanceEntity: AttendanceEntity): void {
        setLastSavedAttendanceEntity(cloneObj(attendanceEntity));
    }

    /**
     * Call this on input value change if value is invalid.
     *
     * Flash the `tooltipColor`, call snackbar with an error message.
     *
     * @param invalidValue the invalid input value from attendance input
     * @param reason brief description about why this value is invalid
     * @param invalidAttendanceInputKey the field name of {@link AttendanceEntity} for the invalid input
     * @param callback executed at the end of this method if specified
     * @param snackbarStatus default is 'info'
     */
    async function handleInvalidAttendanceInput(
        invalidValue: string | number,
        reason: string,
        invalidAttendanceInputKey: keyof AttendanceEntity,
        callback?: () => void,
        snackbarStatus: CustomSnackbarStatus = "info"
    ): Promise<void> {
        const flash = async () => {
            setCurrentlyInvalidAttendanceInputKey(invalidAttendanceInputKey);
            await flashTooltipIcon();
            flashTooltipIconOnce(ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR); // stick with error color
        };

        flash();

        if (!dontShowInvalidInputErrorPopup) {
            snackbar(
                <AttendanceInputErrorSnackbarContent invalidValue={invalidValue} reason={reason} />,
                snackbarStatus,
                {
                    duration: Infinity,
                    action: {
                        label: "Dismiss",
                    },
                },
                () => {
                    setDidDismiss(true);
                    setDidConfirm(true);
                }
            );
        }

        if (callback) callback();
    }

    function resetInvalidAttendanceInputErrorStyles(): void {
        setTooltipIconColor(ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR);
        hideSnackbar();
    }

    return <AttendanceContext.Provider value={context}>{children}</AttendanceContext.Provider>;
}

export const AttendanceContext = createContext({
    updateCurrentAttendanceEntity: <T extends ValueOf<AttendanceEntity>>(
        keyValues: Map<keyof AttendanceEntity, T> | [keyof AttendanceEntity, T]
    ): void => {},

    currentAttendanceEntity: undefined as AttendanceEntity | undefined,
    setCurrentAttendanceEntity: (attendanceEntity: AttendanceEntity): void => {},
    lastSavedAttendanceEntity: undefined as AttendanceEntity | undefined,
    updateLastSavedAttendanceEntity: (attendanceEntity: AttendanceEntity): void => {},

    isCurrentAttendanceEntityModified: false as boolean,
    setCurrentAttendanceEntityModified: (modified: boolean): void => {},

    handleInvalidAttendanceInput: (
        invalidValue: string | number,
        reason: string,
        invalidAttendanceInputKey: keyof AttendanceEntity,
        callback?: () => void,
        status: CustomSnackbarStatus = "info"
    ): void => {},
    resetInvalidAttendanceInputErrorStyles: (): void => {},

    tooltipIconColor: "black" as ColorValue,
    setTooltipIconColor: (color: ColorValue): void => {},
    currentlyInvalidAttendanceInputKey: undefined as keyof AttendanceEntity | undefined,
});

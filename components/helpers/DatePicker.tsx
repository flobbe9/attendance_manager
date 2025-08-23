import { DatePickerStyles } from "@/assets/styles/DatePickerStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import { logTrace } from "@/utils/logUtils";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import React, { forwardRef, Fragment, Ref, useContext, useState } from "react";
import { GestureResponderEvent, View, ViewStyle } from "react-native";
import { DatePickerModal, DatePickerModalSingleProps } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import HelperButton, { HelperButtonProps } from "./HelperButton";
import HelperText from "./HelperText";
import { FontAwesome } from "@expo/vector-icons";
import { BORDER_RADIUS, FONT_SIZE, FONT_SIZE_SMALLER } from "@/utils/styleConstants";
import Flex from "./Flex";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import HelperView from "./HelperView";
import HelperStyles from "@/assets/styles/helperStyles";
import { GlobalContext } from "../context/GlobalContextProvider";

export type DatePickerValue = { startDate: CalendarDate; endDate: CalendarDate } & { date: CalendarDate } & { dates: Date[] };

interface Props extends HelperButtonProps {
    date: CalendarDate;
    setDate: (date: CalendarDate) => void;
    /** Default is "de". Remember to register locales in "GlobalContextProvider.tsx" before adding more. See also https://web-ridge.github.io/react-native-paper-dates/docs/intro/ */
    locale?: "de" | "en";
    /** May throw an error to prevent setting `date` state. Will dismiss regardless */
    onConfirm?: (params: DatePickerValue) => void;
    modalProps?: Omit<DatePickerModalSingleProps, "locale" | "mode" | "visible" | "date" | "onDismiss" | "onConfirm">;
    clearButtonProps?: HelperButtonProps
}

/**
 * Pass children to determine the buttons content, e.g. for custom date format.
 *
 * @since 0.0.1
 */
export default forwardRef(function DatePicker({ date, setDate, locale = "de", onPress, onConfirm, modalProps, clearButtonProps = {}, ...props }: Props, ref: Ref<View>) {
    const [isVisible, setIsVisible] = useState(false);

    const { prs } = useContext(GlobalContext);

    const componentName = "DatePicker";
    const { children, ...otherProps } = useHelperProps(props, componentName, DatePickerStyles.component);

    function handleDismiss(): void {
        setIsVisible(false);
    }

    function handleConfirm(params: DatePickerValue): void {
        try {
            if (onConfirm) onConfirm(params);

            // intended to cancel confirm
        } catch (e) {
            if (e.message) logTrace(e.message);

            return;
        } finally {
            handleDismiss();
        }

        setDate(params.date);
    }

    function handlePress(event: GestureResponderEvent): void {
        if (onPress) onPress(event);

        setIsVisible(!isVisible);
    }

    function handleClearButtonPress(event: GestureResponderEvent): void {
        if (clearButtonProps.onPress)
            clearButtonProps.onPress(event);
        
        setDate(null);
    }

    return (
        <Flex alignItems="center">
            <DatePickerModal
                startWeekOnMonday
                locale={locale}
                mode="single"
                visible={isVisible}
                animationType="slide"
                date={date}
                onDismiss={handleDismiss}
                {...modalProps}
                onConfirm={handleConfirm}
            />

            <HelperButton ref={ref} {...otherProps} onPress={handlePress}>
                {children ?? <HelperText>{date ? formatDateGermanNoTime(date) : modalProps.emptyLabel ?? "NA"}</HelperText>}
            </HelperButton>

            <HelperButton
                disabled={otherProps.disabled || date === null || clearButtonProps.disabled}
                style={{
                    borderRadius: BORDER_RADIUS,
                    backgroundColor: (otherProps.style as ViewStyle).backgroundColor,
                    ...clearButtonProps.style as object
                }}
                {...clearButtonProps}
                containerStyles={{
                    default: {
                        ...prs("ms_2")
                    }
                }}
                onPress={handleClearButtonPress}
            >
                <FontAwesome name="close" size={FONT_SIZE_SMALLER} style={{height: FONT_SIZE, lineHeight: FONT_SIZE}} />
            </HelperButton>
        </Flex>
    );
});

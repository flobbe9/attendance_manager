import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import HS from "@/assets/styles/helperStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { logTrace } from "@/utils/logUtils";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import React, { forwardRef, Fragment, Ref, useState } from "react";
import { GestureResponderEvent, View, ViewProps, ViewStyle } from "react-native";
import { DatePickerModal, DatePickerModalSingleProps } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import HelperButton from "./HelperButton";
import HelperText from "./HelperText";

export type DatePickerValue = {startDate: CalendarDate; endDate: CalendarDate} & {date: CalendarDate} & {dates: Date[]};

interface Props extends HelperProps<ViewStyle>, ViewProps {
    date: CalendarDate
    setDate: (date: CalendarDate) => void,
    /** Default is "de". Remember to register locales in "GlobalContextProvider.tsx" before adding more. See also https://web-ridge.github.io/react-native-paper-dates/docs/intro/ */
    locale?: "de" | "en",
    buttonStyles?: DynamicStyle<ViewStyle>,
    /** May throw an error to prevent setting `date` state. Will dismiss regardless */
    onConfirm?:  (params: DatePickerValue) => void
    modalProps?: Omit<DatePickerModalSingleProps, "locale" | "mode" | "visible" | "date" | "onDismiss" | "onConfirm">
}


/**
 * Pass children to determine the buttons content, e.g. for custom date format.
 * 
 * @since 0.0.1
 */
export default forwardRef(function DatePicker(
    {
        date,
        setDate,
        locale = "de",
        onTouchStart,
        onConfirm,
        buttonStyles,
        modalProps,
        ...props
    }: Props,
    ref: Ref<View>) {

    const [isVisible, setIsVisible] = useState(false);

    const componentName = "DatePicker";
    const { style, children, ...otherProps } = useDefaultProps(props, componentName, buttonStyles);

    function handleDismiss(): void {
        setIsVisible(false);
    }

    function handleConfirm(params: DatePickerValue): void {
        try {
            if (onConfirm)
                onConfirm(params);

        // intended to cancel confirm
        } catch (e) {
            if (e.message)
                logTrace(e.message)
            
            return;

        } finally {
            handleDismiss();
        }

        setDate(params.date);
    }


    function handlePress(event: GestureResponderEvent): void {
        if (onTouchStart)
            onTouchStart(event);

        setIsVisible(!isVisible);
    }
    

    return (
        <Fragment>
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

            <HelperButton
                ref={ref}
                style={{
                    ...HS.fitContent,
                    ...style as object,
                }}
                onPress={handlePress} 
                {...otherProps}
            >
                {children ?? <HelperText>{date ? formatDateGermanNoTime(date) :  'NA'}</HelperText>}
            </HelperButton>
        </Fragment>
    )
})
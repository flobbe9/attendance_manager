import { DynamicStyle } from "@/abstract/DynamicStyle";
import HelperProps from "@/abstract/HelperProps";
import HS from "@/assets/styles/helperStyles";
import HelperView from "@/components/helpers/HelperView";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import React, { forwardRef, Fragment, Ref, useState } from "react";
import { GestureResponderEvent, View, ViewProps, ViewStyle } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import HelperButton from "./HelperButton";
import HelperText from "./HelperText";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    date: CalendarDate
    setDate: (date: CalendarDate) => void,
    /** Default is "de". Remember to register locales in "GlobalContextProvider.tsx" before adding more. See also https://web-ridge.github.io/react-native-paper-dates/docs/intro/ */
    locale?: "de" | "en",
    buttonStyles?: DynamicStyle<ViewStyle>
}


/**
 * Passing children will completely replace this component's default children.
 * 
 * @since 0.0.1
 */
export default forwardRef(function DatePicker(
    {
        date,
        setDate,
        locale = "de",
        onTouchStart,
        buttonStyles,
        ...props
    }: Props,
    ref: Ref<View>) {

    const [isVisible, setIsVisible] = useState(false);

    const componentName = "DatePicker";
    const { style, children, ...otherProps } = useDefaultProps(props, componentName);


    function DefaultChildren(): JSX.Element {

        const dateString = date ?  formatDateGermanNoTime(date) :  'NA';

        return (
            <HelperButton dynamicStyle={buttonStyles}>
                <HelperText>{dateString}</HelperText>        
            </HelperButton>
        );  
    }


    function handleDismiss(): void {

        setIsVisible(false);
    }


    function handleConfirm(params: {startDate: CalendarDate; endDate: CalendarDate} & {date: CalendarDate} & {dates: Date[]}): void {

        setDate(params.date);
        setIsVisible(false);
    }


    function handleTouchStart(event: GestureResponderEvent): void {

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
                date={date}
                onDismiss={handleDismiss}
                onConfirm={handleConfirm}
            />

            <HelperView
                ref={ref}
                style={{
                    ...HS.fitContent,
                    ...style as object,
                }}
                onTouchStart={handleTouchStart} 
                {...otherProps}
            >
                {children ?? <DefaultChildren />}
            </HelperView>
        </Fragment>
    )
})
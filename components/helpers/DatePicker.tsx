import { DynamicStyles } from "@/abstract/DynamicStyles";
import HelperProps from "@/abstract/HelperProps";
import HS from "@/assets/styles/helperStyles";
import HelperView from "@/components/helpers/HelperView";
import { useDefaultProps } from "@/hooks/useDefaultProps";
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
    buttonStyles?: DynamicStyles<ViewStyle>
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
        onTouchEnd,
        buttonStyles,
        ...props
    }: Props,
    ref: Ref<View>) {

    const [isVisible, setIsVisible] = useState(false);

    const componentName = "DatePicker";
    const { style, children, ...otherProps } = useDefaultProps(props, componentName);


    function DefaultChildren(): JSX.Element {

        return (
            <HelperButton dynamicStyles={buttonStyles}>
                <HelperText>{`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}</HelperText>        
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


    function handleTouchEnd(event: GestureResponderEvent): void {

        if (onTouchEnd)
            onTouchEnd(event);

        setIsVisible(!isVisible);
    }
    

    return (
        <Fragment>
            <DatePickerModal
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
                    ...style as object
                }}
                onTouchEnd={handleTouchEnd} 
                {...otherProps}
            >
                {children ?? <DefaultChildren />}
            </HelperView>
        </Fragment>
    )
})
import HelperProps from "@/abstract/HelperProps";
import "@/assets/styles/AttendanceLinkStyles.ts";
import HelperView from "@/components/helpers/HelperView";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { MUSIC_COLOR, HISTORY_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import Br from "./helpers/Br";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import P from "./helpers/P";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import { useHelperProps } from "@/hooks/useHelperProps";
import HS from "@/assets/styles/helperStyles";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    subject?: "Musik" | "Geschichte",
    date?: Date
}    


/**
 * @since 0.0.1
 */
export default function AttendanceLink({
    subject,
    date,
    ...props
}: Props) {

    const componentName = "AttendanceLink";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, AttendanceLinkStyles.component);

    function getDate(): string {

        if (!date)
            return "Noch kein Termin";

        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    }

    function getColor(): string {

        return subject === "Geschichte" ? HISTORY_COLOR : MUSIC_COLOR;
    }

    return (
        <HelperView
            style={{
                borderColor: getColor(),
                ...style as object
            }}
            {...otherProps}
        >
            <Link href="/(attendance)">
                <P dynamicStyle={AttendanceLinkStyles.heading}>{subject}</P>
                <Br />

                <Flex 
                    style={{
                        justifyContent: "space-between", 
                        width: "100%",
                    }}
                >
                    <HelperText 
                        dynamicStyle={AttendanceLinkStyles.subheading}
                    >
                        {getDate()}
                    </HelperText>
                     
                    <Flex>
                        {children}
                    </Flex>
                </Flex>

            </Link>
        </HelperView>
    )
}
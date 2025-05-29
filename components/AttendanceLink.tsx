import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey } from "@/abstract/SchoolSubject";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import "@/assets/styles/AttendanceLinkStyles.ts";
import { AttendanceEntity } from "@/backend/DbSchema";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { getSubjectColor, useSubjectColor } from "@/hooks/useSubjectColor";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import { FONT_SIZE } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import Br from "./helpers/Br";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import P from "./helpers/P";
import { ExaminantService } from "@/backend/services/ExaminantService";


interface Props extends HelperProps<ViewStyle>, ViewProps {
    attendanceEntity: AttendanceEntity
}    


/**
 * @since 0.0.1
 */
export default function AttendanceLink({
    attendanceEntity,
    ...props
}: Props) {

    const { date, schoolSubject, examinants } = attendanceEntity;
    
    const {color: attendanceColor, transparentColor: attendanceColorTransparent} = useSubjectColor(schoolSubject);

    const componentName = "AttendanceLink";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, AttendanceLinkStyles.component);

    const examinantService = new ExaminantService();
    

    function getDate(): string {

        if (!date)
            return "Noch kein Termin";

        return formatDateGermanNoTime(date);
    }


    function mapExaminantIcons(): JSX.Element[] {

        if (!examinants)
            return [];

        return examinantService.sortByRole(examinants)
            .map((examinant, i) => 
                <FontAwesome name="user" color={getSubjectColor(examinant.role)} size={FONT_SIZE} key={i} />);
    }

    return (
        <HelperView
            style={{
                borderColor: attendanceColor,
                // TODO: add GUB condition
                    // consider structure for all non-db conditions
                backgroundColor: attendanceColorTransparent,
                ...style as object
            }}
            {...otherProps}
        >
            <Link href="/(attendance)">
                <P dynamicStyle={AttendanceLinkStyles.heading}>{getSchoolSubjectBySchoolSubjectKey(schoolSubject)}</P>
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
                        {/* dont use a state or this wont update correctly */}
                        {mapExaminantIcons()}
                    </Flex>
                </Flex>

                {children}
            </Link>
        </HelperView>
    )
}
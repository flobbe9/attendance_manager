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
import { Text, ViewProps, ViewStyle } from "react-native";
import Br from "./helpers/Br";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import P from "./helpers/P";
import { ExaminantService } from "@/backend/services/ExaminantService";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import HelperStyles from './../assets/styles/helperStyles';
import B from "./helpers/B";


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

    const { allStyles: { ms_1, col_4, mb_2 }} = useResponsiveStyles();
    
    function getDate(): string {
        if (!date)
            return "Noch kein Termin";

        return formatDateGermanNoTime(date);
    }

    function mapExaminantIcons(): JSX.Element[] {
        if (!examinants)
            return [];

        return examinantService
            .sortByRole(examinants)
            .map((examinant, i) => 
                <FontAwesome
                    name={examinant.role === "headmaster" ? "graduation-cap" : "user"} 
                    color={getSubjectColor(examinant.role)} 
                    size={FONT_SIZE} 
                    key={i} 
                    style={{...ms_1}}
                />
            );
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
                <HelperView>
                    {/* Top row */}
                    <HelperView style={{...HelperStyles.fullWidth, ...mb_2}}>
                        <HelperText 
                            numberOfLines={1} // ellipsis 
                            dynamicStyle={AttendanceLinkStyles.heading}
                        >
                            {/* Subject */}
                            <B>{getSchoolSubjectBySchoolSubjectKey(schoolSubject)}</B>
                            {/* Topic if present */}
                            <HelperText>
                                {`${attendanceEntity.musicLessonTopic ? ` - ${getMusicLessonTopicByMusicLessonTopicKey(attendanceEntity.musicLessonTopic)}` : ''}`}
                            </HelperText>
                        </HelperText>
                    </HelperView>

                    {/* Bottom row */}
                    <Flex 
                        style={{
                            justifyContent: "space-between", 
                            width: "100%",
                        }}
                    >
                        <HelperText 
                            dynamicStyle={AttendanceLinkStyles.subheading}
                            style={{...col_4}}
                        >
                            {getDate()}
                        </HelperText>

                        <Flex justifyContent="flex-end" style={{...col_4}}> 
                            <HelperText>J. {attendanceEntity.schoolYear || ''} {` | ${attendanceEntity.musicLessonTopic ?? ' - '}`}</HelperText>
                        </Flex>

                        <Flex justifyContent="flex-end" style={{...col_4}}>
                            {/* dont use a state or this wont update correctly */}
                            {mapExaminantIcons()}
                        </Flex>
                    </Flex>

                    {children}
                </HelperView>
            </Link>
        </HelperView>
    )
}
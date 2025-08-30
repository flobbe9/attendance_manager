import HelperProps from "@/abstract/HelperProps";
import { getMusicLessonTopicByMusicLessonTopicKey } from "@/abstract/MusicLessonTopic";
import { getSchoolSubjectBySchoolSubjectKey } from "@/abstract/SchoolSubject";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import "@/assets/styles/AttendanceLinkStyles.ts";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { ExaminantService } from "@/backend/services/ExaminantService";
import HelperView from "@/components/helpers/HelperView";
import { useHelperProps } from "@/hooks/useHelperProps";
import { getSubjectColor, useSubjectColor } from "@/hooks/useSubjectColor";
import { formatDateGermanNoTime } from "@/utils/projectUtils";
import { FONT_SIZE } from "@/utils/styleConstants";
import { isBlank } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { JSX, useContext, useState } from "react";
import { ColorValue, ViewProps, ViewStyle } from "react-native";
import HelperStyles from "./../assets/styles/helperStyles";
import { GlobalContext } from "./context/GlobalContextProvider";
import B from "./helpers/B";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    attendanceEntity: AttendanceEntity;
}

/**
 * @since 0.0.1
 */
export default function AttendanceLink({ attendanceEntity, ...props }: Props) {
    const { date, schoolSubject, examinants, musicLessonTopic, schoolYear } = attendanceEntity;

    const attendanceService = new AttendanceService();

    // color depends on both subject and matching examinant
    const {
        transparentColor: attendanceColorTransparent,
        transparentColorDarker: attendanceColorTransparentDarker,
    } = useSubjectColor(attendanceService.hasExaminant(attendanceEntity, schoolSubject) ? schoolSubject : undefined, "rgb(240, 240, 240)");

    const componentName = "AttendanceLink";
    const { children, style, ...otherProps } = useHelperProps(props, componentName, AttendanceLinkStyles.component);

    const examinantService = new ExaminantService();

    const { prs } = useContext(GlobalContext);

    const errorColor = "red";

    function getDate(): string {
        if (!date) return "Noch zu terminieren";

        return formatDateGermanNoTime(date);
    }

    function getTopic(): string {
        const defaultTopic = schoolSubject === "history" ? "" : "Thema";
        return `${!isBlank(musicLessonTopic) ? `${getMusicLessonTopicByMusicLessonTopicKey(musicLessonTopic)}` : defaultTopic}`;
    }

    function mapExaminantIcons(): JSX.Element[] {
        if (!examinants) return [];

        return examinantService
            .sortByRole(examinants)
            .map((examinant, i) => (
                <FontAwesome
                    name={examinant.role === "headmaster" ? "graduation-cap" : "user"}
                    color={getSubjectColor(examinant.role)}
                    size={FONT_SIZE}
                    key={i}
                    style={{ ...prs("ms_1") }}
                />
            ));
    }

    function getBackgroundColor(): ColorValue {
        return attendanceService.isGub(attendanceEntity) ? attendanceColorTransparentDarker : attendanceColorTransparent;
    }

    return (
        <HelperView
            style={{
                backgroundColor: getBackgroundColor(),
                ...(style as object),
            }}
            {...otherProps}
        >
            <Link href="/(indexStack)/(attendance)">
                <HelperView>
                    {/* Top row */}
                    <Flex style={{ ...HelperStyles.fullWidth, ...prs("mb_2") }} flexDirection="column" justifyContent="space-between">
                        {/* Subject */}
                        <B ellipsis dynamicStyle={AttendanceLinkStyles.heading}>{getSchoolSubjectBySchoolSubjectKey(schoolSubject)}</B>

                        {/* Topic */}
                        <HelperText
                            style={{
                                color: !isBlank(musicLessonTopic) ? undefined : errorColor,
                                fontStyle: !isBlank(musicLessonTopic) ? undefined : "italic",
                                ...AttendanceLinkStyles.topic,
                            }}
                            ellipsis
                            rendered={schoolSubject !== "history"}
                        >
                            {getTopic()}
                        </HelperText>
                    </Flex>

                    {/* Bottom row */}
                    <Flex
                        justifyContent="space-between"
                        alignItems="flex-end"
                        style={{
                            ...HelperStyles.fullWidth,
                        }}
                    >
                        {/* Date */}
                        <HelperText
                            dynamicStyle={AttendanceLinkStyles.bottomRowElement}
                            style={{
                                fontStyle: date ? undefined : "italic",
                                ...prs("col_4"),
                            }}
                        >
                            {getDate()}
                        </HelperText>

                        {/* SchoolYear */}
                        <Flex justifyContent="center" style={{ ...prs("col_4") }}>
                            <HelperText
                                dynamicStyle={AttendanceLinkStyles.bottomRowElement}
                                style={{
                                    fontStyle: schoolYear ? undefined : "italic",
                                    fontWeight: schoolYear ? "bold" : undefined,
                                }}
                            >
                                {schoolYear || "Jahrgang"}
                            </HelperText>
                        </Flex>

                        {/* Examinants */}
                        <Flex justifyContent="flex-end" style={{ ...prs("col_4") }}>
                            {/* NOTE: dont use a state or this wont update correctly */}
                            {mapExaminantIcons()}

                            {/* Invalid */}
                            {!examinants?.length && (
                                <FontAwesome 
                                    name="user-o" 
                                    size={FONT_SIZE - 2} 
                                    style={{ ...AttendanceLinkStyles.bottomRowElement.default }} 
                                />
                            )}
                        </Flex>
                    </Flex>

                    {children}
                </HelperView>
            </Link>
        </HelperView>
    );
}

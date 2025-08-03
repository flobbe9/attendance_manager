import HelperProps from "@/abstract/HelperProps";
import {getMusicLessonTopicByMusicLessonTopicKey} from "@/abstract/MusicLessonTopic";
import {getSchoolSubjectBySchoolSubjectKey} from "@/abstract/SchoolSubject";
import {AttendanceLinkStyles} from "@/assets/styles/AttendanceLinkStyles";
import "@/assets/styles/AttendanceLinkStyles.ts";
import {AttendanceService} from "@/backend/services/AttendanceService";
import {ExaminantService} from "@/backend/services/ExaminantService";
import HelperView from "@/components/helpers/HelperView";
import {useHelperProps} from "@/hooks/useHelperProps";
import {useResponsiveStyles} from "@/hooks/useResponsiveStyles";
import {getSubjectColor, useSubjectColor} from "@/hooks/useSubjectColor";
import {formatDateGermanNoTime} from "@/utils/projectUtils";
import {FONT_SIZE} from "@/utils/styleConstants";
import {FontAwesome} from "@expo/vector-icons";
import {Link} from "expo-router";
import React, {JSX, useContext} from "react";
import {ViewProps, ViewStyle} from "react-native";
import HelperStyles from "./../assets/styles/helperStyles";
import B from "./helpers/B";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { GlobalContext } from "./context/GlobalContextProvider";

interface Props extends HelperProps<ViewStyle>, ViewProps {
    attendanceEntity: AttendanceEntity;
}

/**
 * @since 0.0.1
 */
export default function AttendanceLink({attendanceEntity, ...props}: Props) {
    const {date, schoolSubject, examinants, musicLessonTopic, schoolYear} = attendanceEntity;

    const attendanceService = new AttendanceService();

    // color depends on both subject and matching examinant
    const {color: attendanceColor, transparentColor: attendanceColorTransparent} = useSubjectColor(
        attendanceService.hasExaminant(attendanceEntity, schoolSubject) ? schoolSubject : undefined
    );

    const componentName = "AttendanceLink";
    const {children, style, ...otherProps} = useHelperProps(
        props,
        componentName,
        AttendanceLinkStyles.component
    );

    const examinantService = new ExaminantService();

    const { prs } = useContext(GlobalContext);

    const errorColor = "red";

    function getDate(): string {
        if (!date) return "Termin";

        return formatDateGermanNoTime(date);
    }

    function getTopic(): string {
        const defaultTopic = schoolSubject === "history" ? "" : " - <Thema>";
        return `${
            musicLessonTopic
                ? ` - ${getMusicLessonTopicByMusicLessonTopicKey(musicLessonTopic)}`
                : defaultTopic
        }`;
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
                    style={{...prs("ms_1")}}
                />
            ));
    }

    return (
        <HelperView
            style={{
                borderColor: attendanceService.isGub(attendanceEntity)
                    ? attendanceColor
                    : "transparent",
                backgroundColor: attendanceColorTransparent,
                ...(style as object),
            }}
            {...otherProps}
        >
            <Link href="/(attendance)">
                <HelperView>
                    {/* Top row */}
                    <HelperView style={{...HelperStyles.fullWidth, ...prs("mb_2")}}>
                        <HelperText
                            numberOfLines={1} // ellipsis
                            dynamicStyle={AttendanceLinkStyles.heading}
                        >
                            {/* Subject */}
                            <B>{getSchoolSubjectBySchoolSubjectKey(schoolSubject)}</B>

                            {/* Topic if present */}
                            <HelperText style={{color: musicLessonTopic ? "" : errorColor}}>
                                {getTopic()}
                            </HelperText>
                        </HelperText>
                    </HelperView>

                    {/* Bottom row */}
                    <Flex
                        justifyContent="space-between"
                        style={{
                            ...HelperStyles.fullWidth,
                        }}
                    >
                        <HelperText
                            dynamicStyle={AttendanceLinkStyles.subheading}
                            style={{
                                color: date ? "" : errorColor,
                                ...prs("col_4"),
                            }}
                        >
                            {getDate()}
                        </HelperText>

                        <Flex justifyContent="center" style={{...prs("col_4")}}>
                            <HelperText
                                style={{
                                    color: schoolYear ? "" : errorColor,
                                }}
                            >
                                {schoolYear || "Jahrgang"}
                            </HelperText>
                        </Flex>

                        <Flex justifyContent="flex-end" style={{...prs("col_4")}}>
                            {/* dont use a state or this wont update correctly */}
                            {mapExaminantIcons()}

                            {/* Invalid examinants */}
                            <HelperText rendered={!examinants?.length}>
                                <FontAwesome
                                    name="user-o"
                                    size={FONT_SIZE - 2}
                                    color={errorColor}
                                />
                            </HelperText>
                        </Flex>
                    </Flex>

                    {children}
                </HelperView>
            </Link>
        </HelperView>
    );
}

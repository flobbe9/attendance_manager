import HelperProps from "@/abstract/HelperProps";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { IndexTopBarStyles } from "@/assets/styles/IndexTopBarStyles";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ColorValue, ViewProps, ViewStyle } from "react-native";
import { GlobalAttendanceContext } from "./context/GlobalAttendanceContextProvider";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function IndexTopBar({...props}: Props) {

    const { savedAttendanceEntities } = useContext(GlobalAttendanceContext);

    const [numEducators, setNumEducators] = useState<number | null>(null);
    const [numMusicExaminants, setNumMusicExaminants] = useState(0);
    const [numHistoryExaminants, setNumHistoryExaminants] = useState(0);

    const componentName = "IndexTopBar";
    const { children, ...otherProps } = useDefaultProps(props, componentName, IndexTopBarStyles.component);

    const attendanceService = new AttendanceService();

    const { allStyles: {me_1, me_2} } =  useResponsiveStyles();


    useEffect(() => {
        setNumEducators(countEducatorExaminants());
        setNumMusicExaminants(countExaminantsWithSameSubject("music"));
        setNumHistoryExaminants(countExaminantsWithSameSubject("history"));

    }, [savedAttendanceEntities]);

    
    /**
     * @returns the number of attendance entities having at least one educator examinant
     */
    function countEducatorExaminants(): number {

        return savedAttendanceEntities
            .filter(attendanceEntity => 
                attendanceService.hasExaminant(attendanceEntity, "educator"))
            .length;
    }


    /**
     * @param schoolSubject to match attendanceEntity and examinants agains
     * @returns the number of attendanceEntities with `schoolSubject` that also have at least one examinant with `role === schoolSubject`
     */
    function countExaminantsWithSameSubject(schoolSubject: SchoolSubject_Key): number {

        if (!schoolSubject)
            return NaN;

        return savedAttendanceEntities
            .filter(attendanceEntity => 
                attendanceEntity.schoolSubject === schoolSubject && // is attendance with that subject
                attendanceService.hasExaminant(attendanceEntity, schoolSubject)) // has examinant for that subject
            .length;
    }


    function ExaminantCount(props: {numExaminants: number, maxExamiants: number, color: ColorValue}) {

        const {numExaminants, maxExamiants, color} = props;

        return (
            <Flex 
                dynamicStyle={IndexTopBarStyles.ExaminantCount} 
                alignItems="center"
            >
                <FontAwesome style={{color, ...IndexTopBarStyles.text, ...me_1, ...me_2}} name="user" />
                <HelperText style={IndexTopBarStyles.text}>{numExaminants ?? '-'}/{maxExamiants}</HelperText>
            </Flex>
        )
    }


    return ( 
        <Flex 
            justifyContent="flex-end" 
            {...otherProps}
        >
            <HelperText style={{...IndexTopBarStyles.text, ...me_2}}>Erledigt:</HelperText>

            <ExaminantCount numExaminants={numMusicExaminants} maxExamiants={9} color={MUSIC_COLOR} />
            <ExaminantCount numExaminants={numHistoryExaminants} maxExamiants={9} color={HISTORY_COLOR} />
            <ExaminantCount numExaminants={numEducators} maxExamiants={8} color={"black"} />
        </Flex>
    )
}
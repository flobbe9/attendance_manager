import HelperProps from "@/abstract/HelperProps";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { IndexTopBarStyles } from "@/assets/styles/IndexTopBarStyles";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Flex from "./helpers/Flex";
import HelperText from "./helpers/HelperText";
import { GlobalAttendanceContext } from "./context/GlobalAttendanceContextProvider";
import { log } from "@/utils/logUtils";
import { useExaminantRepository } from "@/hooks/repositories/useExaminantRepository";


interface Props extends HelperProps<ViewStyle>, ViewProps {

}


/**
 * @since 0.0.1
 */
export default function IndexTopBar({...props}: Props) {

    const { allAttendanceEntities } = useContext(GlobalAttendanceContext);

    const { examinantRepository } = useExaminantRepository();

    const [numEducators, setNumEducators] = useState<number | null>(null);

    const componentName = "IndexTopBar";
    const { children, ...otherProps } = useDefaultProps(props, componentName, IndexTopBarStyles.component);

    useEffect(() => {
    }, [allAttendanceEntities]);

    useEffect(() => {
        updateNumEducators();

    }, []);

    
    async function updateNumEducators(): Promise<void> {

        setNumEducators(await examinantRepository.countByRole("educator") ?? null);
    }


    // subject examinants
        // find all examinants where attendance.school_subject == examinant role

    return ( 
        <Flex 
            justifyContent="flex-end" 
            dynamicStyle={IndexStyles.statusBarContainer}
            {...otherProps}
        >
            <HelperText>Erledigt:</HelperText>

            <Flex 
                style={{
                    marginStart: 10
                }}
                alignItems="center"
            >
                <FontAwesome
                    style={{
                        color: MUSIC_COLOR,
                    }}
                    name="user" 
                />
                <HelperText>1/9</HelperText>
            </Flex>

            <Flex 
                style={{
                    marginStart: 10
                }}
                alignItems="center"
            >
                <FontAwesome
                    style={{
                        color: HISTORY_COLOR,
                    }}
                    name="user" 
                />
                <HelperText>2/9</HelperText>
            </Flex>

            <Flex 
                style={{
                    marginStart: 10
                }}
                alignItems="center"
            >
                <FontAwesome
                    style={{
                        color: "black",
                    }}
                    name="user" 
                />
                <HelperText>{numEducators ?? '-'}/8</HelperText>
            </Flex>
        </Flex>
    )
}
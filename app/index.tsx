import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/DbSchema";
import AttendanceLink from "@/components/AttendanceLink";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import IndexTopBar from "@/components/IndexTopBar";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { getRandomString } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";


/**
 * @since 0.0.1
 */
export default function index() {

    const { snackbar } = useContext(GlobalContext);
    const { allAttendanceEntities, setAllAttendanceEntities, setCurrentAttendanceEntityId } = useContext(GlobalAttendanceContext);

    const [attendanceLinks, setAttendanceLinks] = useState<JSX.Element[]>([]);
    const [isExtended, setIsExtended] = useState(true);

    const { attendanceRespository } = useAttendanceRepository();

    const { allStyles: {mt_5} } = useResponsiveStyles();

    const isScreenInView = useIsFocused();


    useEffect(() => {
        loadAttendanceEntities();

    }, [isScreenInView]); // triggered on any child stack screen visit


    useEffect(() => {
        setAttendanceLinks(mapAttendanceLinks(allAttendanceEntities));

    }, [allAttendanceEntities]);

    
    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {

        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        
        setIsExtended(currentScrollPosition <= 0);
    };


    /**
     * @param attendanceEntities expected to be fetched with cascade
     */
    function mapAttendanceLinks(attendanceEntities: AttendanceEntity[]): JSX.Element[] {

        if (!attendanceEntities)
            return [];

        return attendanceEntities
            .map(attendanceEntity => 
                <AttendanceLink 
                    key={getRandomString()} // make sure this is rerendered on screen enter 
                    attendanceEntity={attendanceEntity} 
                    onTouchStart={() => setCurrentAttendanceEntityId(attendanceEntity.id)}
                />
            );
    }


    // TODO: consider max num and pageable?
        // test how long 30 attendances take to load
    async function loadAttendanceEntities(): Promise<void> {

        const attendanceEntities = await attendanceRespository.selectCascade();

        setAllAttendanceEntities(attendanceEntities ?? []);
    }


    // display something if no attendances yet
        // maybe large button or something


    return (
        <ScreenWrapper>
            <HelperView dynamicStyle={IndexStyles.component}>
                <IndexTopBar />

                <HelperScrollView onScroll={handleScroll} dynamicStyle={IndexStyles.linkContainer} style={{...mt_5 }}>
                    {attendanceLinks}
                </HelperScrollView>

                <Link 
                    href={"/(attendance)"} 
                    asChild 
                    onPress={() => setCurrentAttendanceEntityId(-1)}
                >
                    <ExtendableButton 
                        isExtended={isExtended}
                        dynamicStyle={IndexStyles.addButton}
                        containerStyles={IndexStyles.addButtonOuterView}
                        align="flex-end"
                        extendedWidth={152}
                        label={<HelperText dynamicStyle={{...IndexStyles.addButtonLabel}} style={{color: "white"}}>Neuer UB</HelperText>}
                        ripple={{rippleBackground: "rgb(70, 70, 70)"}}
                    > 
                        <FontAwesome name="plus" style={{...IndexStyles.buttonIcon}} color="white" />
                    </ExtendableButton>
                </Link>
            </HelperView>
        </ScreenWrapper>
    )
}
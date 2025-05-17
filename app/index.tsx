import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/DbSchema";
import AttendanceLink from "@/components/AttendanceLink";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import { IndexContext } from "@/components/context/IndexContextProvider";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import IndexTopBar from "@/components/IndexTopBar";
import { useAttendanceRepository } from "@/hooks/repositories/useAttendanceRepository";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";


/**
 * @since 0.0.1
 */
export default function index() {

    const { toast, hideToast } = useContext(GlobalContext);
    const { setCurrentAttendanceEntity, allAttendanceEntities, setAllAttendanceEntities } = useContext(IndexContext);

    const [attendanceLinks, setAttendanceLinks] = useState<JSX.Element[]>([]);
    const [isExtended, setIsExtended] = useState(true);

    const { attendanceRespository } = useAttendanceRepository();

    // TODO: warn if wrong obj name
    const { allStyles: {mt_5} } = useResponsiveStyles();


    useEffect(() => {
        loadAttendanceEntities();

    }, []);


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
            .map((attendanceEntity, i) => 
                <AttendanceLink 
                    key={i} 
                    attendanceEntity={attendanceEntity} 
                    onTouchEnd={() => setCurrentAttendanceEntity(attendanceEntity)}
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

                {/* <Link href={"/(attendance)"} asChild> */}
                    <ExtendableButton 
                        isExtended={isExtended}
                        dynamicStyle={IndexStyles.addButton}
                        containerStyles={IndexStyles.addButtonOuterView}
                        align="flex-end"
                        extendedWidth={152}
                        label={<HelperText dynamicStyle={{...IndexStyles.addButtonLabel}} style={{color: "white"}}>Neuer UB</HelperText>}
                        ripple={{rippleBackground: "rgb(70, 70, 70)"}}
                        onPress={() => {
                            toast((
                                <HelperView>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdfasdfasdfasdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                    <HelperText>asdf</HelperText>
                                </HelperView>
                            ),
                            {
                                childrenContainerStyle: {width: 200, height: 200}
                            })
                        }}
                    >
                        <FontAwesome name="plus" style={IndexStyles.buttonIcon} color="white" />
                    </ExtendableButton>
                {/* </Link> */}
            </HelperView>
        </ScreenWrapper>
    )
}
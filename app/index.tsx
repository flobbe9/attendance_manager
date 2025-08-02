import HelperStyles from "@/assets/styles/helperStyles";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import AttendanceLink from "@/components/AttendanceLink";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import Flex from "@/components/helpers/Flex";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import IndexTopBar from "@/components/IndexTopBar";
import { useFileLogger } from "@/hooks/useFileLogger";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import { JSX, useContext, useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

/**
 * @since 0.0.1
 */
export default function index() {
    const { savedAttendanceEntities, setCurrentAttendanceEntityId, updateSavedAttendanceEntities } = useContext(GlobalAttendanceContext);

    const [attendanceLinks, setAttendanceLinks] = useState<JSX.Element[]>([]);
    const [isExtended, setIsExtended] = useState(true);

    const { initializeFileLogger } = useFileLogger();

    const {
        allStyles: { mt_6 },
    } = useResponsiveStyles();

    const attendanceService = new AttendanceService();

    const isScreenInView = useIsFocused();

    useEffect(() => {
        initializeFileLogger();
    }, []); // once on app start (not refocus from background)

    useEffect(() => {
        if (isScreenInView) updateSavedAttendanceEntities();
    }, [isScreenInView]); // triggered on focus and blur of /app/index view

    useEffect(() => {
        setAttendanceLinks(mapAttendanceLinks(savedAttendanceEntities));
    }, [savedAttendanceEntities]);

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    }

    /**
     * Sort by subject asc.
     *
     * @param attendanceEntities expected to be fetched with cascade
     */
    function mapAttendanceLinks(attendanceEntities: AttendanceEntity[]): JSX.Element[] {
        if (!attendanceEntities) return [];

        return attendanceEntities
            .sort(attendanceService.sortBySubject)
            .map((attendanceEntity, i) => (
                <AttendanceLink key={i} attendanceEntity={attendanceEntity} onTouchStart={() => setCurrentAttendanceEntityId(attendanceEntity.id)} />
            ));
    }

    return (
        <ScreenWrapper>
            <HelperView dynamicStyle={IndexStyles.component}>
                <IndexTopBar />

                {/* Links */}
                <HelperScrollView
                    onScroll={handleScroll}
                    dynamicStyle={IndexStyles.linkContainer}
                    style={{ ...mt_6 }}
                    childrenContainerStyle={{ paddingBottom: 50 }}
                    rendered={!!attendanceLinks.length}
                >
                    {attendanceLinks}
                </HelperScrollView>

                {/* Empty message */}
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ ...HelperStyles.fullHeight }}
                    rendered={!attendanceLinks.length}
                >
                    <HelperText dynamicStyle={IndexStyles.emptyMessage}>😴</HelperText>
                    <HelperText dynamicStyle={IndexStyles.emptyMessage}>Noch keine Unterrichtsbesuche...</HelperText>
                </Flex>

                {/* Add button */}
                <Link href={"/(attendance)"} asChild onPress={() => setCurrentAttendanceEntityId(-1)}>
                    <ExtendableButton
                        isExtended={isExtended}
                        dynamicStyle={IndexStyles.addButton}
                        containerStyles={IndexStyles.addButtonContainer}
                        align="flex-end"
                        extendedWidth={152}
                        label={
                            <HelperText dynamicStyle={IndexStyles.addButtonLabel}>
                                Neuer UB
                            </HelperText>
                        }
                        ripple={{ rippleBackground: "rgb(70, 70, 70)" }}
                    >
                        <FontAwesome name="plus" style={IndexStyles.addButtonLabel.default} />
                    </ExtendableButton>
                </Link>
            </HelperView>
        </ScreenWrapper>
    );
}

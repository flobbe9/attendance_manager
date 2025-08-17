import { AttendanceFilterWrapper } from "@/abstract/AttendanceFilterWrapper";
import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { PartialRecord } from "@/abstract/PartialRecord";
import { getSchoolSubjectBySchoolSubjectKey, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getOppositeSortOrder, SortOrder } from "@/abstract/SortOrder";
import { SortWrapper } from "@/abstract/SortWrapper";
import HelperStyles from "@/assets/styles/helperStyles";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import AttendanceLink from "@/components/AttendanceLink";
import AttendanceLinkFilters from "@/components/AttendanceLinkFilters";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import { IndexContext } from "@/components/context/IndexContextProvider";
import B from "@/components/helpers/B";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import IndexTopBar from "@/components/IndexTopBar";
import { getSubjectColor } from "@/hooks/useSubjectColor";
import { cloneObj } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import { JSX, useContext, useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Divider, RadioButton, SegmentedButtons } from "react-native-paper";

/**
 * @since 0.0.1
 */
export default function index() {
    const { prs, popup } = useContext(GlobalContext);
    const { attendanceLinkFilterWrappers, attendanceLinkSortWrappers} = useContext(IndexContext);
    const { savedAttendanceEntities, setCurrentAttendanceEntityId, updateSavedAttendanceEntities } = useContext(GlobalAttendanceContext);

    const [attendanceLinksNoGub, setAttendanceLinksNoGub] = useState<JSX.Element[]>([]);
    const [attendanceLinksGub, setAttendanceLinksGub] = useState<JSX.Element[]>([]);

    const [isExtended, setIsExtended] = useState(true);

    const attendanceService = new AttendanceService();

    const isScreenInView = useIsFocused();

    useEffect(() => {
        if (isScreenInView) updateSavedAttendanceEntities();
    }, [isScreenInView]); // triggered on focus and blur of /app/index view

    useEffect(() => {
        setAttendanceLinksNoGub(mapAttendanceLinksWithoutGub(savedAttendanceEntities));
        setAttendanceLinksGub(mapttendanceLinksWithGub(savedAttendanceEntities));
    }, [savedAttendanceEntities, attendanceLinkFilterWrappers, attendanceLinkSortWrappers]);

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    }

    function mapAttendanceLinksWithoutGub(attendanceEntities: AttendanceEntity[]): JSX.Element[] {
        if (!attendanceEntities) return [];

        return mapAttendanceLinks(attendanceEntities)
            .filter((attendanceEntity) => !attendanceService.isGub(attendanceEntity))
            .map((attendanceEntity, i) => mapAttendanceLink(attendanceEntity, i));
    }

    function mapttendanceLinksWithGub(attendanceEntities: AttendanceEntity[]): JSX.Element[] {
        if (!attendanceEntities) return [];

        return mapAttendanceLinks(attendanceEntities)
            .filter((attendanceEntity) => attendanceService.isGub(attendanceEntity))
            .map((attendanceEntity, i) => mapAttendanceLink(attendanceEntity, i));
    }

    /**
     * Do the general filtering and sorting here, all link map functions will use this.
     *
     * @param attendanceEntities wont modify
     * @returns
     */
    function mapAttendanceLinks(attendanceEntities: AttendanceEntity[]): AttendanceEntity[] {
        if (!attendanceEntities) return [];

        let attendanceEntitiesCloned = cloneObj(attendanceEntities);

        // filter
        attendanceEntitiesCloned = attendanceEntitiesCloned.filter((attendanceEntity) => {
            // case: no filters selected, dont filter at all
            if (!Object.keys(attendanceLinkFilterWrappers).length) return true;

            return !!Array.from(Object.entries(attendanceLinkFilterWrappers)).find(([, filterWrapper]) => {
                return filterWrapper.filter(attendanceEntity);
            });
        });

        // sort
        Object.values(attendanceLinkSortWrappers).forEach((attendanceLinkSortWrapper) =>
            attendanceEntitiesCloned.sort((a1, a2) => attendanceLinkSortWrapper.compare(a1, a2, attendanceLinkSortWrapper.sortOrder))
        );

        return attendanceEntitiesCloned;
    }

    function mapAttendanceLink(attendanceEntity: AttendanceEntity, key: number | string): JSX.Element {
        return (
            <AttendanceLink
                key={`${attendanceEntity.schoolSubject}_${key}`}
                attendanceEntity={attendanceEntity}
                dynamicStyle={IndexStyles.attendanceLink}
                onTouchStart={() => setCurrentAttendanceEntityId(attendanceEntity.id)}
            />
        );
    }

    return (
        <ScreenWrapper>
            <HelperView dynamicStyle={IndexStyles.component}>
                <IndexTopBar />

                {/* Links */}
                <HelperScrollView
                    onScroll={handleScroll}
                    dynamicStyle={IndexStyles.linkContainer}
                    style={{ ...prs("mt_1") }}
                    childrenContainerStyle={{ paddingBottom: 50 }}
                    rendered={!!attendanceLinksNoGub.length || !!attendanceLinksGub.length}
                >
                    {attendanceLinksGub}

                    {!!attendanceLinksNoGub.length && !!attendanceLinksGub.length && (
                        <HelperView>
                            <Divider style={{ ...prs("mb_3", "mt_2") }} />
                        </HelperView>
                    )}

                    {attendanceLinksNoGub}
                </HelperScrollView>

                {/* Empty message */}
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{...prs("mt_10", "mt_md_3")}}
                    rendered={!savedAttendanceEntities.length}
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
                        label={<HelperText dynamicStyle={IndexStyles.addButtonLabel}>Neuer UB</HelperText>}
                        ripple={{ rippleBackground: "rgb(70, 70, 70)" }}
                    >
                        <FontAwesome name="plus" style={IndexStyles.addButtonLabel.default} />
                    </ExtendableButton>
                </Link>
            </HelperView>
        </ScreenWrapper>
    );
}

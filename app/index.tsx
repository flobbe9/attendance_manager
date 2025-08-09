import { AttendanceFilterWrapper } from "@/abstract/AttendanceFilterWrapper";
import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { PartialRecord } from "@/abstract/PartialRecord";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getOppositeSortOrder, SortOrder } from "@/abstract/SortOrder";
import { SortWrapper } from "@/abstract/SortWrapper";
import HelperStyles from "@/assets/styles/helperStyles";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import AttendanceLink from "@/components/AttendanceLink";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
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
import { Divider, RadioButton } from "react-native-paper";

/**
 * @since 0.0.1
 */
export default function index() {
    const { prs } = useContext(GlobalContext);
    const { savedAttendanceEntities, setCurrentAttendanceEntityId, updateSavedAttendanceEntities } = useContext(GlobalAttendanceContext);

    const [attendanceLinks, setAttendanceLinks] = useState<JSX.Element[]>([]);
    const [gubAttendanceLinks, setGubAttendanceLinks] = useState<JSX.Element[]>([]);

    const [isExtended, setIsExtended] = useState(true);

    const attendanceService = new AttendanceService();
    const [attendanceLinkFilterWrappers, setAttendanceLinkFilterWrappers] = useState<PartialRecord<SchoolSubject_Key, AttendanceFilterWrapper>>({});
    // last elements take priority over first elements
    const [attendanceLinkSortWrappers, setAttendanceLinkSortWrappers] = useState<
        PartialRecord<keyof AttendanceEntity, SortWrapper<AttendanceEntity>>
    >({
        date: {
            sortOrder: SortOrder.DESC,
            compare: attendanceService.compareDate,
        },
        schoolSubject: {
            sortOrder: SortOrder.ASC,
            compare: attendanceService.compareSchoolSubject,
        },
    });

    const isScreenInView = useIsFocused();

    useEffect(() => {
        if (isScreenInView) updateSavedAttendanceEntities();
    }, [isScreenInView]); // triggered on focus and blur of /app/index view

    useEffect(() => {
        setAttendanceLinks(mapAttendanceLinksWithoutGub(savedAttendanceEntities));
        setGubAttendanceLinks(mapGubAttendanceLinksWithGub(savedAttendanceEntities));
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

    function mapGubAttendanceLinksWithGub(attendanceEntities: AttendanceEntity[]): JSX.Element[] {
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
                onTouchStart={() => setCurrentAttendanceEntityId(attendanceEntity.id)}
            />
        );
    }

    /**
     * Add or remove filter wrapper to filter state and update.
     * 
     * @param filterValue `null` if no filters should be applied
     * @param classField for comparing `filterValue`
     * @param isFilter whether to add filter wrapper instead of removing it
     */
    function updateFilter(filterValue: string | number | null, classField: keyof AttendanceEntity, isFilter: boolean): void {
        // case: dont filter
        if (filterValue === null) {
            setAttendanceLinkFilterWrappers({});
            return;
        }

        if (isFilter) attendanceLinkFilterWrappers[filterValue] = new AttendanceFilterWrapper(filterValue, classField);
        else delete attendanceLinkFilterWrappers[filterValue];

        setAttendanceLinkFilterWrappers({
            ...attendanceLinkFilterWrappers,
        });
    }

    /**
     * Add sort wrapper with `classField` to the bottom of sort state for it to take priority.
     * 
     * @param classField to sort by
     */
    function updateSort(classField: keyof AttendanceEntity): void {
        attendanceLinkSortWrappers[classField].sortOrder = getOppositeSortOrder(attendanceLinkSortWrappers[classField].sortOrder);

        setAttendanceLinkSortWrappers({
            ...attendanceLinkSortWrappers,
            [classField]: attendanceLinkSortWrappers[classField],
        });
    }

    function getSortButtonIcon(sortOrder: SortOrder): FontAweSomeIconname {
        return sortOrder === SortOrder.ASC ? "sort-asc" : "sort-desc";
    }

    return (
        <ScreenWrapper>
            <HelperView dynamicStyle={IndexStyles.component}>
                <IndexTopBar />

                <Flex 
                    justifyContent="space-between" 
                    alignItems="center" 
                    style={{ ...HelperStyles.fullWidth, ...prs("mt_5") }}
                    rendered={!!attendanceLinks.length}
                >
                    <Flex alignItems="center">
                        <FontAwesome name="filter" style={{ ...IndexStyles.sortButtonIcon, ...prs("me_2") }} />

                        <RadioButton
                            value={null}
                            status={!Object.keys(attendanceLinkFilterWrappers).length ? "checked" : "unchecked"}
                            onPress={() => updateFilter(null, null, false)}
                        />

                        <RadioButton
                            value={"history"}
                            status={Object.hasOwn(attendanceLinkFilterWrappers, "history") ? "checked" : "unchecked"}
                            color={getSubjectColor("history") as string}
                            uncheckedColor={getSubjectColor("history") as string}
                            onPress={() => {
                                updateFilter("history", "schoolSubject", true);
                                updateFilter("music", "schoolSubject", false);
                            }}
                        />

                        <RadioButton
                            value={"music"}
                            status={Object.hasOwn(attendanceLinkFilterWrappers, "music") ? "checked" : "unchecked"}
                            color={getSubjectColor("music") as string}
                            uncheckedColor={getSubjectColor("music") as string}
                            onPress={() => {
                                updateFilter("music", "schoolSubject", true);
                                updateFilter("history", "schoolSubject", false);
                            }}
                        />
                    </Flex>

                    <Flex alignItems="center">
                        <FontAwesome name="sort" style={{ ...IndexStyles.sortButtonIcon, ...prs("me_2") }} />
                        <HelperButton disableFlex dynamicStyle={IndexStyles.sortButton} onPress={() => updateSort("date")}>
                            <HelperText>Termin</HelperText>
                            <FontAwesome style={IndexStyles.sortButtonIcon} name={getSortButtonIcon(attendanceLinkSortWrappers.date.sortOrder)} />
                        </HelperButton>

                        <HelperButton disableFlex dynamicStyle={IndexStyles.sortButton} onPress={() => updateSort("schoolSubject")}>
                            <HelperText>Fach</HelperText>
                            <FontAwesome
                                style={IndexStyles.sortButtonIcon}
                                name={getSortButtonIcon(attendanceLinkSortWrappers.schoolSubject.sortOrder)}
                            />
                        </HelperButton>
                    </Flex>
                </Flex>

                {!!attendanceLinks.length && <Divider />}

                {/* Links */}
                <HelperScrollView
                    onScroll={handleScroll}
                    dynamicStyle={IndexStyles.linkContainer}
                    style={{ ...prs("mt_3") }}
                    childrenContainerStyle={{ paddingBottom: 50 }}
                    rendered={!!attendanceLinks.length}
                >
                    {gubAttendanceLinks}

                    {!!gubAttendanceLinks.length && (
                        <HelperView>
                            <Divider style={{ marginBottom: 20, marginTop: 10 }} />
                        </HelperView>
                    )}

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

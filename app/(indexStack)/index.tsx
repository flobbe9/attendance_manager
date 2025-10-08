import { PartialRecord } from "@/abstract/PartialRecord";
import { SortWrapper } from "@/abstract/SortWrapper";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import AttendanceLink from "@/components/AttendanceLink";
import { GlobalAttendanceContext } from "@/components/context/GlobalAttendanceContextProvider";
import { GlobalContext } from "@/components/context/GlobalContextProvider";
import { IndexContext } from "@/components/context/IndexContextProvider";
import B from "@/components/helpers/B";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import Flex from "@/components/helpers/Flex";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import IndexTopBar from "@/components/IndexTopBar";
import { AsyncStorageImpl } from "@/utils/AsyncStorageImpl";
import { ATTENDANCE_LINK_FILTER_WRAPPERS_CACHE_KEY, ATTENDANCE_LINK_SORT_WRAPPERS_CACHE_KEY, IS_RENDER_ATTENDANCE_LINK_SECTIONS_CACHE_KEY } from "@/utils/constants";
import { LIGHT_COLOR } from "@/utils/styleConstants";
import { cloneObj, isFalsy } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { JSX, useContext, useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";

interface SectionedAttendanceLinksConditions {
    isGub: boolean;
    dateMode?: "future" | "pastPresent" | "all";
}

/**
 * @since 0.0.1
 */
export default function index() {
    const { prs } = useContext(GlobalContext);
    const { 
        attendanceLinkFilterWrappers, 
        attendanceLinkSortWrappers, 
        isRenderAttendanceLinksSections, 
        setAttendanceLinkFilterWrappers, 
        setAttendanceLinkSortWrappers, 
        setRenderAttendanceLinkSections 
    } = useContext(IndexContext);
    const { savedAttendanceEntities, setCurrentAttendanceEntityId, updateSavedAttendanceEntities } = useContext(GlobalAttendanceContext);

    const { navigate } = useRouter();

    /** Indicates that sort/filter attendance link wrappers states have been initialized with values from async storage */
    const [didLoadWrappersFromCache, setDidLoadWrappersFromCache] = useState(false);

    const [attendanceLinksAll, setAttendanceLinksAll] = useState<JSX.Element[]>([]);

    const [attendanceLinksPastPresent, setAttendanceLinksPastPresent] = useState<JSX.Element[]>([]);
    const [attendanceLinksFuture, setAttendanceLinksFuture] = useState<JSX.Element[]>([]);
    const [attendanceLinksGub, setAttendanceLinksGub] = useState<JSX.Element[]>([]);

    const [isExtended, setIsExtended] = useState(true);

    const attendanceService = new AttendanceService();
    const asyncStorage = new AsyncStorageImpl();

    const isScreenInView = useIsFocused();

    useEffect(() => {
        initAttendanceLinkWrappersStates();
    }, []); // on app launch only (triggered twice though)

    useEffect(() => {
        if (isScreenInView) updateSavedAttendanceEntities();
    }, [isScreenInView]); // triggered on focus and blur of /app/index view

    useEffect(() => {
        if (didLoadWrappersFromCache)
            updateAttendanceLinkStates();
    }, [savedAttendanceEntities, attendanceLinkFilterWrappers, attendanceLinkSortWrappers, isRenderAttendanceLinksSections, didLoadWrappersFromCache]);
    
    useEffect(() => {
        if (didLoadWrappersFromCache)
            updateAttendanceLinkWrappersCache();
    }, [attendanceLinkFilterWrappers, attendanceLinkSortWrappers, isRenderAttendanceLinksSections, didLoadWrappersFromCache]);

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    }

    function updateAttendanceLinkStates() {
        if (!isRenderAttendanceLinksSections)
            setAttendanceLinksAll(mapAttendanceLinks(filterAttendanceLinksGeneral(savedAttendanceEntities)));
        
        else {
            setAttendanceLinksPastPresent(
                mapAttendanceLinks(
                    filterAttendanceLinksSectioned(savedAttendanceEntities, { isGub: false, dateMode: "pastPresent" })));
            setAttendanceLinksFuture(
                mapAttendanceLinks(
                    filterAttendanceLinksSectioned(savedAttendanceEntities, { isGub: false, dateMode: "future" })));
            setAttendanceLinksGub(
                mapAttendanceLinks(
                    filterAttendanceLinksSectioned(savedAttendanceEntities, { isGub: true, dateMode: "all" })));
        }
    }

    /**
     * @param attendanceEntities to filter (not modified)
     * @param sectionConditions the filter conditions
     * @returns filtered `attendanceEntities` or empty array
     */
    function filterAttendanceLinksSectioned(
        attendanceEntities: AttendanceEntity[],
        sectionConditions: SectionedAttendanceLinksConditions
    ): AttendanceEntity[] {
        if (!attendanceEntities) return [];

        let filteredAttendanceLinks = [...attendanceEntities];

        // gub
        filteredAttendanceLinks = filteredAttendanceLinks.filter((attendanceEntity) => {
            const isGub = attendanceService.isGub(attendanceEntity);
            const attendanceIsFuture = attendanceService.isFutureAttendance(attendanceEntity);
            return (!isGub && !sectionConditions.isGub) || 
                (isGub && 
                    // past gubs in GUB section
                    (sectionConditions.isGub && !attendanceIsFuture) ||
                    // future gubs in FUTURE section
                    (sectionConditions.dateMode === "future" && attendanceIsFuture)
                );
        });

        // date
        if (sectionConditions.dateMode !== "all")
            filteredAttendanceLinks = filteredAttendanceLinks.filter((attendanceEntity) => {
                const attendanceIsFuture = attendanceService.isFutureAttendance(attendanceEntity);
                return (
                    (attendanceIsFuture && sectionConditions.dateMode === "future") ||
                    (!attendanceIsFuture && sectionConditions.dateMode === "pastPresent")
                );
            });

        filteredAttendanceLinks = filterAttendanceLinksGeneral(filteredAttendanceLinks);

        return filteredAttendanceLinks;
    }

    /**
     * Do the general filtering and sorting here, all link map functions will use this.
     *
     * @param attendanceEntities wont modify
     * @returns
     */
    function filterAttendanceLinksGeneral(attendanceEntities: AttendanceEntity[]): AttendanceEntity[] {
        if (!attendanceEntities) return [];

        let attendanceEntitiesCloned = cloneObj(attendanceEntities);

        // filter
        attendanceEntitiesCloned = attendanceEntitiesCloned.filter((attendanceEntity) => {
            // case: no filters selected, dont filter at all
            if (!Object.keys(attendanceLinkFilterWrappers).length) return true;

            return !!Array.from(Object.entries(attendanceLinkFilterWrappers))
                .find(([, filterWrapper]) => filterWrapper.filterValue === attendanceEntity[filterWrapper.classField]);
        });

        // sort
        Array.from(Object.entries(attendanceLinkSortWrappers))
            .forEach(([classField, attendanceLinkSortWrapper]) => {
                if (attendanceLinkSortWrapper.enabled)
                    attendanceEntitiesCloned.sort((a1, a2) => 
                        attendanceService.compare(a1, a2, attendanceLinkSortWrapper, classField as keyof AttendanceEntity))
            });

        return attendanceEntitiesCloned;
    }

    function mapAttendanceLinks(attendanceEntities: AttendanceEntity[]): JSX.Element[] {
        if (!attendanceEntities) return [];

        return attendanceEntities.map(mapAttendanceLink);
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

    function handleAddButtonPress(): void {
        navigate("/(indexStack)/(attendance)");
        setCurrentAttendanceEntityId(-1);
    }

    function AttendanceLinkDevider({ rendered = true }) {
        return (
            <HelperView rendered={rendered}>
                <Divider style={IndexStyles.attendanceLinkDevider} />
            </HelperView>
        );
    }

    /**
     * Update the async storage values for all sort/filter wrappers using the current states.
     */
    async function updateAttendanceLinkWrappersCache(): Promise<void> {
        await asyncStorage.set(ATTENDANCE_LINK_FILTER_WRAPPERS_CACHE_KEY, attendanceLinkFilterWrappers);
        await asyncStorage.set(ATTENDANCE_LINK_SORT_WRAPPERS_CACHE_KEY, attendanceLinkSortWrappers);
        await asyncStorage.set(IS_RENDER_ATTENDANCE_LINK_SECTIONS_CACHE_KEY, isRenderAttendanceLinksSections + "");
    }

    /**
     * Update states for all sort/filter wrappers using the currently cached values (if not falsy).
     */
    async function initAttendanceLinkWrappersStates(): Promise<void> {
        // parse then set with arg = false
        const cachedAttendanceLinkFilterWrappers: object = await asyncStorage.get(ATTENDANCE_LINK_FILTER_WRAPPERS_CACHE_KEY, true) as object;
        if (cachedAttendanceLinkFilterWrappers)
            setAttendanceLinkFilterWrappers(cachedAttendanceLinkFilterWrappers);

        const cachedAttendanceLinkSortWrappers: PartialRecord<keyof AttendanceEntity, SortWrapper> = await asyncStorage.get(ATTENDANCE_LINK_SORT_WRAPPERS_CACHE_KEY, true) as object;
        if (cachedAttendanceLinkSortWrappers)
            setAttendanceLinkSortWrappers(cachedAttendanceLinkSortWrappers);

        const cachedRenderAttendanceLinkSections = await asyncStorage.get(IS_RENDER_ATTENDANCE_LINK_SECTIONS_CACHE_KEY) === "true";
        if (!isFalsy(cachedRenderAttendanceLinkSections))
            setRenderAttendanceLinkSections(cachedRenderAttendanceLinkSections);

        setDidLoadWrappersFromCache(true);
    }

    return (
        <ScreenWrapper>
            <HelperView dynamicStyle={IndexStyles.component}>
                <IndexTopBar />

                {/* Links */}
                <HelperScrollView
                    dynamicStyle={IndexStyles.linkContainer}
                    style={{ ...prs("mt_1") }}
                    childrenContainerStyle={{ ...prs("pb_6") }}
                    rendered={!!attendanceLinksPastPresent.length || !!attendanceLinksFuture.length || !!attendanceLinksGub.length || !!attendanceLinksAll.length}
                    stickyHeaderIndices={isRenderAttendanceLinksSections ? [0, 2, 4] : []}
                    onScroll={handleScroll}
                >
                    {/* Future section */}
                    <B
                        dynamicStyle={IndexStyles.attendanceLinkLabel}
                        rendered={isRenderAttendanceLinksSections && !!attendanceLinksFuture.length}
                    >
                        Noch offen
                    </B>
                    <HelperView rendered={isRenderAttendanceLinksSections && !!attendanceLinksFuture.length}>
                        {attendanceLinksFuture}

                        <AttendanceLinkDevider rendered={!!attendanceLinksGub.length || !!attendanceLinksPastPresent.length} />
                    </HelperView>

                    {/* Gub section */}
                    <B dynamicStyle={IndexStyles.attendanceLinkLabel} rendered={isRenderAttendanceLinksSections && !!attendanceLinksGub.length}>
                        GUBs
                    </B>
                    <HelperView rendered={isRenderAttendanceLinksSections && !!attendanceLinksGub.length}>
                        {attendanceLinksGub}

                        <AttendanceLinkDevider rendered={!!attendanceLinksPastPresent.length} />
                    </HelperView>

                    {/* Past / Present section */}
                    <B
                        dynamicStyle={IndexStyles.attendanceLinkLabel}
                        rendered={isRenderAttendanceLinksSections && !!attendanceLinksPastPresent.length}
                    >
                        Erledigt
                    </B>
                    <HelperView rendered={isRenderAttendanceLinksSections && !!attendanceLinksPastPresent.length}>
                        {attendanceLinksPastPresent}
                    </HelperView>

                    {/* All (no section) */}
                    <HelperView rendered={!isRenderAttendanceLinksSections}>{attendanceLinksAll}</HelperView>
                </HelperScrollView>

                {/* Empty message */}
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ ...prs("mt_10", "mt_md_3") }}
                    rendered={!savedAttendanceEntities.length}
                >
                    <HelperText dynamicStyle={IndexStyles.emptyMessage}>😴</HelperText>
                    <HelperText dynamicStyle={IndexStyles.emptyMessage}>Noch keine Unterrichtsbesuche...</HelperText>
                </Flex>

                {/* Loading wrappers from cache */}
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ ...prs("mt_10", "mt_md_3") }}
                    rendered={!!savedAttendanceEntities.length && !didLoadWrappersFromCache}
                >
                    <ActivityIndicator animating={true} color={LIGHT_COLOR} size={50} />
                </Flex>

                {/* Add button */}
                <ExtendableButton
                    isExtended={isExtended}
                    dynamicStyle={IndexStyles.addButton}
                    containerStyles={IndexStyles.addButtonContainer}
                    align="flex-end"
                    extendedWidth={152}
                    label={<HelperText dynamicStyle={IndexStyles.addButtonLabel}>Neuer UB</HelperText>}
                    ripple={{ rippleBackground: "rgb(70, 70, 70)" }}
                    onPress={handleAddButtonPress}
                >
                    <FontAwesome name="plus" style={IndexStyles.addButtonLabel.default} />
                </ExtendableButton>
            </HelperView>
        </ScreenWrapper>
    );
}

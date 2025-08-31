import { AttendanceFilterWrapper } from "@/abstract/AttendanceFilterWrapper";
import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import HelperProps from "@/abstract/HelperProps";
import { getSchoolSubjectBySchoolSubjectKey, SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { getOppositeSortOrder, SortOrder } from "@/abstract/SortOrder";
import { AttendanceLinkFiltersStyles } from "@/assets/styles/AttendanceLinkFiltersStyles";
import HS from "@/assets/styles/helperStyles";
import { IndexStyles } from "@/assets/styles/IndexStyles";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { useHelperProps } from "@/hooks/useHelperProps";
import { getSubjectColor } from "@/hooks/useSubjectColor";
import { FontAwesome } from "@expo/vector-icons";
import React, { useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import { SegmentedButtons, SegmentedButtonsProps } from "react-native-paper";
import { IndexContext } from "./context/IndexContextProvider";
import Flex from "./helpers/Flex";
import HelperButton from "./helpers/HelperButton";
import HelperText from "./helpers/HelperText";
import { AssetContext } from "./context/AssetProvider";
import HelperView from "./helpers/HelperView";
import HelperCheckbox from "./helpers/HelperCheckbox";
import { DEFAULT_FONT_SIZE, LIGHT_COLOR } from "@/utils/styleConstants";
import { GlobalContext } from "./context/GlobalContextProvider";

interface Props extends HelperProps<ViewStyle>, ViewProps {}

type FilterValue = "all" | SchoolSubject_Key;

/**
 * @since latest
 */
export default function AttendanceLinkFilters({ ...props }: Props) {
    const { prs } = useContext(GlobalContext);
    const { defaultFontStyles } = useContext(AssetContext);
    const {
        attendanceLinkFilterWrappers,
        setAttendanceLinkFilterWrappers,
        attendanceLinkSortWrappers,
        setAttendanceLinkSortWrappers,
        isRenderAttendanceLinksSections,
        setRenderAttendanceLinkSections,
    } = useContext(IndexContext);

    const componentName = "AttendanceLinkFilters";
    const { children, ...otherProps } = useHelperProps(props, componentName, AttendanceLinkFiltersStyles.component);

    const filterValueButtonProps: Partial<SegmentedButtonsProps["buttons"]> = [
        {
            checkedColor: "white",
            labelStyle: {
                ...defaultFontStyles({}),
            },
            style: {
                ...AttendanceLinkFiltersStyles.filterValueButton,
            },
            // just for completion
            value: "",
        },
    ];

    /**
     * Add or remove filter wrapper to filter state and update.
     *
     * @param filterValue `null` if no filters should be applied
     * @param classField for comparing `filterValue`
     * @param isFilter whether to add filter wrapper instead of removing it
     */
    function updateFilterState(filterValue: string | number | null, classField: keyof AttendanceEntity, isFilter: boolean): void {
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
    function updateSortState(classField: keyof AttendanceEntity): void {
        attendanceLinkSortWrappers[classField].sortOrder = getOppositeSortOrder(attendanceLinkSortWrappers[classField].sortOrder);

        setAttendanceLinkSortWrappers({
            ...attendanceLinkSortWrappers,
            [classField]: attendanceLinkSortWrappers[classField],
        });
    }

    function getSortButtonIcon(sortOrder: SortOrder): FontAweSomeIconname {
        return sortOrder === SortOrder.ASC ? "sort-asc" : "sort-desc";
    }

    function getCurrentFilterValue(): FilterValue {
        if (!Object.keys(attendanceLinkFilterWrappers).length) return "all";

        return Object.keys(attendanceLinkFilterWrappers)[0] as FilterValue;
    }

    function setCurrentFilterValue(filterValue: FilterValue): void {
        if (filterValue === "all") {
            updateFilterState(null, null, false);
        } else if (filterValue === "history") {
            updateFilterState("history", "schoolSubject", true);
            updateFilterState("music", "schoolSubject", false);
        } else if (filterValue === "music") {
            updateFilterState("music", "schoolSubject", true);
            updateFilterState("history", "schoolSubject", false);
        }
    }

    return (
        <HelperView {...otherProps}>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                style={{
                    ...HS.fullWidth,
                }}
            >
                {/* Filter */}
                <SegmentedButtons
                    value={getCurrentFilterValue()}
                    density="small"
                    style={{
                        width: 240,
                        ...AttendanceLinkFiltersStyles.filterInput,
                        ...prs("m_1", "m_md_2", "ms_0")
                    }}
                    buttons={[
                        {
                            ...filterValueButtonProps[0],
                            uncheckedColor: "black",
                            value: "all",
                            label: "Alle",
                            style: {
                                backgroundColor: getCurrentFilterValue() === "all" ? "rgb(100, 100, 100)" : undefined,
                                ...(filterValueButtonProps[0].style as object),
                            },
                        },
                        {
                            ...filterValueButtonProps[0],
                            uncheckedColor: getSubjectColor("history") as string,
                            value: "history",
                            label: getSchoolSubjectBySchoolSubjectKey("history").charAt(0) + " ", // makes label a bit wider to prevent ellipsis on app start
                            style: {
                                backgroundColor: getCurrentFilterValue() === "history" ? getSubjectColor("history") : undefined,
                                ...(filterValueButtonProps[0].style as object),
                            },
                        },
                        {
                            ...filterValueButtonProps[0],
                            uncheckedColor: getSubjectColor("music") as string,
                            value: "music",
                            label: getSchoolSubjectBySchoolSubjectKey("music").charAt(0) + " ", // makes label a bit wider to prevent ellipsis on app start
                            style: {
                                backgroundColor: getCurrentFilterValue() === "music" ? getSubjectColor("music") : undefined,
                                ...(filterValueButtonProps[0].style as object),
                            },
                        },
                    ]}
                    onValueChange={setCurrentFilterValue}
                />

                {/* Sort */}
                <Flex style={{...prs("m_1", "m_md_2", "ms_0")}}>
                    {/* By date */}
                    <HelperButton
                        dynamicStyle={AttendanceLinkFiltersStyles.sortButton}
                        style={{...prs("me_1")}}
                        onPress={() => updateSortState("date")}
                    >
                        <HelperText style={{...prs("me_1")}}>Termin</HelperText>
                        <FontAwesome
                            style={{
                                ...AttendanceLinkFiltersStyles.sortButtonIcon,
                                paddingBottom: attendanceLinkSortWrappers.date.sortOrder === SortOrder.DESC ? AttendanceLinkFiltersStyles.sortButtonIconOffset : undefined,
                                paddingTop: attendanceLinkSortWrappers.date.sortOrder === SortOrder.ASC ? AttendanceLinkFiltersStyles.sortButtonIconOffset : undefined,
                            }}
                            name={getSortButtonIcon(attendanceLinkSortWrappers.date.sortOrder)}
                        />
                    </HelperButton>

                    {/* By subject */}
                    <HelperButton
                        dynamicStyle={AttendanceLinkFiltersStyles.sortButton}
                        onPress={() => updateSortState("schoolSubject")}
                    >
                        <HelperText style={{...prs("me_1")}}>Fach</HelperText>
                        <FontAwesome
                            style={{
                                ...AttendanceLinkFiltersStyles.sortButtonIcon,
                                paddingBottom: attendanceLinkSortWrappers.schoolSubject.sortOrder === SortOrder.DESC ? AttendanceLinkFiltersStyles.sortButtonIconOffset : undefined,
                                paddingTop: attendanceLinkSortWrappers.schoolSubject.sortOrder === SortOrder.ASC ? AttendanceLinkFiltersStyles.sortButtonIconOffset : undefined,
                            }}
                            name={getSortButtonIcon(attendanceLinkSortWrappers.schoolSubject.sortOrder)}
                        />
                    </HelperButton>
                </Flex>

                <Flex style={{...prs("m_1", "m_md_2", "ms_0")}}>
                    <HelperCheckbox
                        iconStyle={AttendanceLinkFiltersStyles.futureCheckboxContent}
                        checked={isRenderAttendanceLinksSections}
                        setChecked={setRenderAttendanceLinkSections}
                    >
                        <HelperText style={AttendanceLinkFiltersStyles.futureCheckboxContent}>Kategorisiert</HelperText>
                    </HelperCheckbox>
                </Flex>
            </Flex>

            {children}
        </HelperView>
    );
}

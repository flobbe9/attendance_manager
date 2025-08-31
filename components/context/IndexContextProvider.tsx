import { AttendanceFilterWrapper } from "@/abstract/AttendanceFilterWrapper";
import { PartialRecord } from "@/abstract/PartialRecord";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SortOrder } from "@/abstract/SortOrder";
import { SortWrapper } from "@/abstract/SortWrapper";
import { AttendanceEntity } from "@/backend/entities/AttendanceEntity";
import { AttendanceService } from "@/backend/services/AttendanceService";
import { createContext, ReactNode, useState } from "react";

/**
 * @since latest
 */
export default function IndexContextProvider({children}: {children: ReactNode}) {
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

    /** Whether to separate the non-gub attendances into past and future */
    const [isRenderAttendanceLinksSections, setRenderAttendanceLinkSections] = useState(true);
    
    const context = {
        attendanceLinkFilterWrappers, setAttendanceLinkFilterWrappers,
        attendanceLinkSortWrappers, setAttendanceLinkSortWrappers,
        isRenderAttendanceLinksSections, setRenderAttendanceLinkSections
    }

    return (
        <IndexContext.Provider value={context}>
            {children}
        </IndexContext.Provider>
    )
}

export const IndexContext = createContext({
    attendanceLinkFilterWrappers: {} as PartialRecord<SchoolSubject_Key, AttendanceFilterWrapper>,
    setAttendanceLinkFilterWrappers:  (wrappers: PartialRecord<SchoolSubject_Key, AttendanceFilterWrapper>): void => {},
    attendanceLinkSortWrappers: {} as  PartialRecord<keyof AttendanceEntity, SortWrapper<AttendanceEntity>>, 
    setAttendanceLinkSortWrappers: (wrappers:  PartialRecord<keyof AttendanceEntity, SortWrapper<AttendanceEntity>>): void => {},
    isRenderAttendanceLinksSections: false as boolean, 
    setRenderAttendanceLinkSections: (separate: boolean): void => {}
})
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import HelperStyles from "@/assets/styles/helperStyles";
import { Attendance_Table, AttendanceEntity, SchoolclassMode_Table, SchoolclassModeEntity } from "@/backend/DbSchema";
import { useDao } from "@/backend/useDao";
import AttendanceLink from "@/components/AttendanceLink";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import Flex from "@/components/helpers/Flex";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { log, logError } from "@/utils/logUtils";
import { HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


/**
 * @since 0.0.1
 */
export default function index() {

    const { dao: attendanceDao } = useDao<AttendanceEntity, typeof Attendance_Table>(Attendance_Table);
    const { dao: schoolclassModeDao } = useDao<SchoolclassModeEntity, typeof SchoolclassMode_Table>(SchoolclassMode_Table);
    // const { dao, drizzleDb } = useDao(Attendance_Table);
    // const { dao, drizzleDb } = useDao<TestEntity, typeof Test_Table>(Test_Table);


    const [isExtended, setIsExtended] = useState(true);

    const { allStyles: {mt_5}} = useResponsiveStyles();
    
    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        
        setIsExtended(currentScrollPosition <= 0);
    };

    async function handlePress(event): Promise<void> {

        log(process.env.EXPO_PUBLIC_DATABASE_NAME)

        const attendance: AttendanceEntity = {
            schoolSubject: "history",
            date: new Date(),
            schoolYear: "5",
            examinants: [],
            schoolclassMode: undefined,
            note: "nooooote",
            note2: "Note2"
        }

        // TODO: continue here
            // try cascade, fix schema first

        // TODO: 
            // questions
                // duplicate realtions definition???
                // cascade?
            // add ids for realtions


        // const attendanceResult = await attendanceDao.insert(attendance);
        // const attendanceResult = await attendanceDao.update(attendance);
        // const attendanceResult = await attendanceDao.delete(eq(Attendance_Table.id, 1))
        // const attendanceResult = await attendanceDao.select(eq(Attendance_Table.id, 5));
        // log(attendanceResult)

        // const schoolclassMode: SchoolclassModeEntity = {
        //     mode: "ownClass",                
        //     fullName: null,
        //     attendanceId: attendanceResult[0].id
        // };

        // const schoolclasModeResult = await schoolclassModeDao.insert(schoolclassMode);

        // log(schoolclasModeResult)
    } 

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <HelperView dynamicStyle={AttendanceIndexStyles.component}>
                    <Flex justifyContent="flex-end" dynamicStyle={AttendanceIndexStyles.statusBarContainer}>
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
                            <HelperText>2/8</HelperText>
                        </Flex>
                    </Flex>

                    <HelperScrollView onScroll={handleScroll} style={{...HelperStyles.fitContent, ...mt_5 }}>
                        {[
                            <AttendanceLink
                                key={0} 
                                dynamicStyle={AttendanceIndexStyles.link} 
                                subject="Musik"
                                date={new Date()}
                            >
                                <FontAwesome
                                    style={{
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                                <FontAwesome
                                    style={{    
                                        color: MUSIC_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={1} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                    backgroundColor: HISTORY_COLOR_TRANSPARENT,
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                                <FontAwesome
                                    style={{
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                                <FontAwesome
                                    style={{    
                                        color: MUSIC_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={2} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={3} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={4} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={5} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={6} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={7} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Geschichte"
                            >
                                <FontAwesome
                                    style={{    
                                        color: HISTORY_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink>,
                            <AttendanceLink
                                key={8} 
                                dynamicStyle={AttendanceIndexStyles.link}
                                style={{
                                }}
                                subject="Musik"
                            >
                                <FontAwesome
                                    style={{    
                                        color: MUSIC_COLOR,
                                        ...AttendanceLinkStyles.icon,
                                    }}
                                    name="user" 
                                />
                            </AttendanceLink> 
                        ]}
                    </HelperScrollView>

                    <ExtendableButton 
                        isExtended={isExtended}
                        dynamicStyle={AttendanceIndexStyles.addButton}
                        containerStyles={AttendanceIndexStyles.addButtonOuterView}
                        align="flex-end"
                        extendedWidth={152}
                        label={<HelperText dynamicStyle={{...AttendanceIndexStyles.addButtonLabel}} style={{color: "white"}}>Neuer UB</HelperText>}
                        ripple={{rippleBackground: "rgb(70, 70, 70)"}}
                        onPress={handlePress}
                    >
                        <FontAwesome name="plus" style={AttendanceIndexStyles.buttonIcon} color="white" />
                    </ExtendableButton>

                    {/* <Link href={"/(attendance)"} asChild>
                        <ExtendableButton 
                            isExtended={isExtended}
                            dynamicStyle={AttendanceIndexStyles.addButton}
                            containerStyles={AttendanceIndexStyles.addButtonOuterView}
                            align="flex-end"
                            extendedWidth={152}
                            label={<HelperText dynamicStyle={{...AttendanceIndexStyles.addButtonLabel}} style={{color: "white"}}>Neuer UB</HelperText>}
                            ripple={{rippleBackground: "rgb(70, 70, 70)"}}
                        >
                            <FontAwesome name="plus" style={AttendanceIndexStyles.buttonIcon} color="white" />
                        </ExtendableButton>
                    </Link> */}
                </HelperView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import AttendanceLink from "@/components/AttendanceLink";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { log } from "@/utils/logUtils";
import { HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";


/**
 * @since 0.0.1
 */
export default function index() {

    const {my_sm_5} = useResponsiveStyles();

    // TODO:
        // add docs
            // in order
            // examples
        // add col
        // consider order problem
            // function with all props, then choose prio?
        // integrate animated styles into dynamic styles obj?

    return (
        <SafeAreaView>
            <HelperView dynamicStyles={AttendanceIndexStyles.component} style={my_sm_5}>
                <Flex justifyContent="flex-end">
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

                <HelperScrollView>
                    {[
                        <AttendanceLink
                            key={0} 
                            dynamicStyles={AttendanceIndexStyles.link} 
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
                            dynamicStyles={AttendanceIndexStyles.link}
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
                            dynamicStyles={AttendanceIndexStyles.link}
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
                        </AttendanceLink>
                    ]}
                </HelperScrollView>

                <Link href={"/(attendance)"} asChild>
                    {/* TODO: make this an FAB */}
                    <HelperButton 
                        dynamicStyles={AttendanceIndexStyles.addButton}
                        containerStyles={AttendanceIndexStyles.addButtonOuterView}
                    >
                        <FontAwesome name="plus" style={AttendanceIndexStyles.buttonIcon} />
                    </HelperButton>
                </Link>
            </HelperView>
        </SafeAreaView>
    )
}
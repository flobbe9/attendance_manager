import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import AttendanceLink from "@/components/AttendanceLink";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { logWarn } from "@/utils/logUtils";
import { HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR, MUSIC_COLOR_TRANSPARENT } from "@/utils/styleConstants";
import { isStringNumeric } from "@/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


/**
 * @since 0.0.1
 */
export default function index() {

    return (
        <SafeAreaView>
            <HelperView dynamicStyles={AttendanceIndexStyles.component}>
                <Flex justifyContent="flex-end">
                    <HelperText>Erledigt:</HelperText>

                    <Flex>
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
                </Flex>

                <HelperScrollView>
                    {[
                        <AttendanceLink
                            key={0} 
                            dynamicStyles={AttendanceIndexStyles.link} 
                            style={{
                            }}
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
import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import AttendanceLink from "@/components/AttendanceLink";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { logWarn } from "@/utils/logUtils";
import { HISTORY_COLOR, MUSIC_COLOR } from "@/utils/styleConstants";
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
            <HelperView dynamicStyle={AttendanceIndexStyles.component}>
                <Flex justifyContent="flex-end">
                    <HelperText>Erledigt:</HelperText>

                    <Flex>
                        <Flex style={{marginStart: 10}} alignItems="center">
                            <FontAwesome
                                style={{
                                    color: MUSIC_COLOR,
                                }}
                                name="user" 
                            />
                            <HelperText>0/9</HelperText>
                        </Flex>

                        <Flex style={{marginStart: 10}} alignItems="center">
                            <FontAwesome
                                style={{
                                    color: HISTORY_COLOR,
                                }}
                                name="user" 
                            />
                            <HelperText>0/9</HelperText>
                        </Flex>

                        <Flex style={{marginStart: 10}} alignItems="center">
                            <FontAwesome
                                style={{
                                    color: "black",
                                }}
                                name="user" 
                            />
                            <HelperText>0/8</HelperText>
                        </Flex>
                    </Flex>
                </Flex>

                <HelperScrollView>
                    {[
                        <AttendanceLink
                            key={0} 
                            dynamicStyle={AttendanceIndexStyles.link} 
                            subject="Musik"
                            date={new Date()}
                        />,
                        <AttendanceLink
                            key={1} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            subject="Geschichte"
                        />,
                        <AttendanceLink
                            key={2} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            subject="Geschichte"
                        />
                    ]}
                </HelperScrollView>

                <Link href={"/(attendance)"} asChild>
                    {/* TODO: make this an FAB */}
                    <HelperButton 
                        dynamicStyle={AttendanceIndexStyles.addButton}
                        containerStyles={AttendanceIndexStyles.addButtonOuterView}
                    >
                        <FontAwesome name="plus" style={AttendanceIndexStyles.buttonIcon} />
                    </HelperButton>
                </Link>
            </HelperView>
        </SafeAreaView>
    )
}
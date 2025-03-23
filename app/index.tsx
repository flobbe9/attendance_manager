import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { HelperStyles } from "@/assets/styles/helperStyles";
import AttendanceLink from "@/components/AttendanceLink";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperView from "@/components/helpers/HelperView";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function index() {

    return (
        <SafeAreaView>
            <HelperView dynamicStyles={AttendanceIndexStyles.component}>
                <HelperScrollView>
                    {[
                        <AttendanceLink
                            key={0} 
                            dynamicStyles={AttendanceIndexStyles.link} 
                            subject="Musik"
                            date={new Date()}
                        />,
                        <AttendanceLink
                            key={1} 
                            dynamicStyles={AttendanceIndexStyles.link}
                            subject="Geschichte"
                        />
                    ]}
                </HelperScrollView>

                <HelperButton 
                    dynamicStyles={AttendanceIndexStyles.addButton}
                    outerViewPropsStyles={AttendanceIndexStyles.addButtonOuterView}
                >
                    <FontAwesome name="plus" style={{...AttendanceIndexStyles.buttonIcon.default}} />
                </HelperButton>
            </HelperView>
        </SafeAreaView>
    )
}
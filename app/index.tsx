import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import AttendanceLink from "@/components/AttendanceLink";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


export default function index() {

    return (
        <SafeAreaView>
            <HelperScrollView dynamicStyles={AttendanceIndexStyles.component}>
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
                ripple={null} 
                dynamicStyles={AttendanceIndexStyles.addButton}
            >
                <FontAwesome name="plus" color={"white"} size={20} />
            </HelperButton>
        </SafeAreaView>
    )
}
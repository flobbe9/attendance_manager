import {FONT_SIZE_LARGER} from "@/utils/styleConstants";
import B from "../helpers/B";
import Br from "../helpers/Br";
import HelperCheckbox from "../helpers/HelperCheckbox";
import HelperView from "../helpers/HelperView";
import HelperText from "../helpers/HelperText";
import {useContext} from "react";
import {GlobalAttendanceContext} from "../context/GlobalAttendanceContextProvider";

/**
 * @since 0.1.0
 * @see SchoolSubjectInput
 */
export default function DontConfirmSchoolSubjectChangeContent() {
    const {dontConfirmSchoolSubjectChange, setDontConfirmSchoolSubjectChange} =
        useContext(GlobalAttendanceContext);

    return (
        <HelperView>
            <B>Fach ändern</B>

            <Br />

            <HelperText>
                Werte, die mit Bedingungen verknüpft sind, werden zurückgesetzt.
            </HelperText>
            <HelperText>Fach ändern?</HelperText>

            <Br />

            <HelperCheckbox
                checked={dontConfirmSchoolSubjectChange}
                setChecked={setDontConfirmSchoolSubjectChange}
                iconStyle={{fontSize: FONT_SIZE_LARGER}}
            >
                <HelperText>Nicht mehr anzeigen</HelperText>
            </HelperCheckbox>
        </HelperView>
    );
}

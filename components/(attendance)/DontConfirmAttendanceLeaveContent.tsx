import { useContext } from "react";
import { GlobalAttendanceContext } from "../context/GlobalAttendanceContextProvider";
import B from "../helpers/B";
import Br from "../helpers/Br";
import HelperCheckbox from "../helpers/HelperCheckbox";
import HelperText from "../helpers/HelperText";
import HelperView from "../helpers/HelperView";
import P from "../helpers/P";

/**
 * @since latest
 */
export function DontConfirmAttendanceLeaveContent() {
    const { dontConfirmAttendanceScreenLeave, setDontConfirmAttendanceScreenLeave } = useContext(GlobalAttendanceContext);
    
    return (
        <HelperView>
            <B>Ohne speichern verlassen?</B>
            <Br />

            <HelperText>Deine letzten Änderungen werden verworfen.</HelperText>
            <P>Bist du sicher?</P>
            
            <HelperCheckbox
                checked={dontConfirmAttendanceScreenLeave}
                setChecked={setDontConfirmAttendanceScreenLeave}
            >
                Nicht mehr nachfragen
            </HelperCheckbox>
        </HelperView>
    )
}
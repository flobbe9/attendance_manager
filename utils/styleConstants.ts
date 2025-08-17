import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { SchoolSubject_Key } from "@/abstract/SchoolSubject";
import { SubjectColor } from "@/hooks/useSubjectColor";
import { ViewStyle } from "react-native";

/** In ms */
export const TRANSITION_DURATION = 200;

/** Colors */
export const EXAMINANT_COLOR_NO_SUBJECT = "black";
export const SUBJECT_COLORS: Record<SchoolSubject_Key, SubjectColor> = {
    history: {
        color: "rgb(0, 110, 255)",
        transparentColor: "rgb(214, 234, 255)",
        transparentColorDarker: "rgb(130, 192, 255)"
    },
    music: {
        color: "rgb(219, 125, 2)",
        transparentColor: "rgb(255, 221, 186)",
        transparentColorDarker: "rgb(255, 179, 103)"
    }
}
// light theme ish
export const LIGHT_COLOR = "rgb(230, 225, 229)";

/** Font */
export const BOLD = 500;

/** Other */
export const BORDER_RADIUS = 8;
export const BORDER_WIDTH = 4;
export const GLOBAL_SCREEN_PADDING = 10;
export const FONT_SIZE = 20;
export const FONT_SIZE_SMALLER = 15;
export const FONT_SIZE_LARGER = 25;
export const DEFAULT_BUTTON_PADDING = 10;
export const TOOLTIP_DEFAULT_ICON: FontAweSomeIconname = "lightbulb-o";

/** Large smartphone (iPhone 14 Pro max) */
export const SM_MIN_WIDTH = 430;
/** Portrait tablet / landscape smartphone */
export const MD_MIN_WIDTH = 660;
/** Large tablet / tablet landscape */
export const LG_MIN_WIDTH = 1024;

/** Toast */
export const TOAST_ERROR_OUTER_STYLES: ViewStyle = {
    backgroundColor: "rgb(255, 179, 179)"
}


/** Attendanceinput Tooltip */
export const ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR = "black";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR = "orange";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_ICON: FontAweSomeIconname = "info-circle";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_FLASH_INTERVAL = 100;
export const ATTENDANCE_INPUT_TOOLTIP_ICON_NUM_FLASHES = 3;
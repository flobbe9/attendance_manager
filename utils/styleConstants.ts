import { FontAweSomeIconname } from "@/abstract/FontAwesomeIconName";
import { NotificationSevirity } from "@/abstract/NotificationSevirity";
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

const statusBorderWidth = 2;
export const NOTIFICATION_SEVIRITY_STYLES: Record<NotificationSevirity, ViewStyle> = {
    error: {
        borderColor: "rgb(255, 50, 0)",
        borderWidth: statusBorderWidth,
    },
    warn: {
        borderColor: "rgb(255, 200, 0)",
        borderWidth: statusBorderWidth,
    },
    info: {
        borderColor: 'transparent',
        borderWidth: statusBorderWidth,
    },
    success: {
        borderColor: "rgb(50, 255, 94)",
        borderWidth: statusBorderWidth,
    },
};

/** Font */
/** The font size used by react native if none specified */
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_WEIGHT = 400;

export const FONT_WEIGHT_BOLD = 500;
export const FONT_FAMILY = 'Lato';
export const FONT_FAMILY_BOLD = 'Lato-Bold';
export const FONT_FAMILY_ITALIC = 'Lato-Italic';
export const FONT_FAMILY_BOLD_ITALIC = 'Lato-Bold-Italic';
/** For `FONT_FAMILY` */
export const LINE_HEIGHT = 1.2;


/** Other */
export const BORDER_RADIUS = 8;
export const BORDER_WIDTH = 4;
export const GLOBAL_SCREEN_PADDING = 10;
export const FONT_SIZE = 20;
export const FONT_SIZE_SMALLER = 15;
export const FONT_SIZE_LARGER = 25;
export const DEFAULT_BUTTON_PADDING = 10;
export const TOOLTIP_DEFAULT_ICON: FontAweSomeIconname = "lightbulb-o";
export const ATTENDANCE_TEXT_INPUT_OPACITY = 0.6;

/** Large smartphone (iPhone 14 Pro max) */
export const SM_MIN_WIDTH = 430;
/** Portrait tablet / landscape smartphone */
export const MD_MIN_WIDTH = 660;
/** Large tablet / tablet landscape */
export const LG_MIN_WIDTH = 1024;

/** Toast */
export const TOAST_ERROR_OUTER_STYLES: ViewStyle = {
    backgroundColor: "rgb(255, 179, 179)",
};

/** Attendanceinput Tooltip */
export const ATTENDANCE_INPUT_TOOLTIP_ICON_COLOR = "black";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_COLOR = "orange";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_ERROR_ICON: FontAweSomeIconname = "info-circle";
export const ATTENDANCE_INPUT_TOOLTIP_ICON_FLASH_INTERVAL = 100;
export const ATTENDANCE_INPUT_TOOLTIP_ICON_NUM_FLASHES = 3;

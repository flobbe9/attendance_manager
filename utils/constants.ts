import {LogLevel} from "@/abstract/LogLevel";
import {DrizzleConfig} from "drizzle-orm";
import ExpoConstants from "expo-constants";

/** Values from app.json file */
export const appJson = ExpoConstants.expoConfig;

export const APP_VERSION = appJson.version;
export const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME;
export const LOG_LEVEL = LogLevel[process.env.EXPO_PUBLIC_LOG_LEVEL];

/** Auth */
export const AUTH_APPLE_REDIRECT_URL = process.env.EXPO_PUBLIC_AUTH_APPLE_REDIRECT_URL;

// Custom log
export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
    [LogLevel.INFO]: "white",
    [LogLevel.WARN]: "rgb(255, 233, 174)",
    [LogLevel.ERROR]: "rgb(255, 230, 230)",
    [LogLevel.DEBUG]: "rgb(230, 230, 230)",
    [LogLevel.TRACE]: "rgb(170, 210, 255)",
};

/** Dont log to console if the 'message' contains one of these strings */
export const CONSOLE_MESSAGES_TO_AVOID: (string | number)[] = [
    "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.",
];

/**
 * @see Checkbox from 'react-native-paper'
 */
export type CheckboxStatus = "checked" | "indeterminate" | "unchecked";

export const DRIZZLE_DB_CONFIG: DrizzleConfig<Record<string, never>> = {
    casing: "snake_case",
};

export const NO_SELECTION_LABEL = "No selection";

export const SQL_BLOB_SIZE = 65_535;

/** Settings */
/** Whether not to show a popup on invalid attendance input. Default shoujld be false */
export const SETTINGS_DONT_SHOW_ATTENDANCE_INPUT_VALIDATOIN_ERROR_POPUP_KEY =
    "dont_show_attendance_input_validation_error_popup";
/** Whether not to show a popup on school subject change. Default shoujld be false */
export const SETTINGS_DONT_CONFIRM_SCHOOL_SUBJECT_CHANGE_KEY = "dont_confirm_school_subject_change";
export const SETTINGS_DONT_CONFIRM_ATTENDANCE_SCREEN_LEAVE = "dont_confirm_attendance_screen_leave";

/** Other */
/** Alpha-numeric chars, `_`, `-` and `.` */
export const SECURE_STORAGE_KEY_REGEX: RegExp = /^[\w\-_\.]*$/;
export const SECURE_STORAGE_MAX_VALUE_LENGTH: number = 2048;

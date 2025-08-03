import { Env } from "@/abstract/Env";
import { LogLevel } from "@/abstract/LogLevel";
import { DrizzleConfig } from "drizzle-orm";
import ExpoConstants from "expo-constants";

/** Values from app.json file */
export const appJson = ExpoConstants.expoConfig;

export const APP_VERSION = appJson.version;
export const APP_NAME = appJson.name;
export const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME;
export const ENV: Env = process.env.EXPO_PUBLIC_ENV as Env;
export const LOG_LEVEL = LogLevel[process.env.EXPO_PUBLIC_LOG_LEVEL] ?? LogLevel.INFO;
export const FILE_LOGGER_ENABLED = process.env.EXPO_PUBLIC_FILE_LOGGER_ENABLED === "true";
export const FILE_LOGGER_MAIL_TO = process.env.EXPO_PUBLIC_FILE_LOGGER_MAIL_TO;

/** Auth */
export const AUTH_APPLE_REDIRECT_URL = process.env.EXPO_PUBLIC_AUTH_APPLE_REDIRECT_URL;

/**
 * @see Checkbox from 'react-native-paper'
 */
export type CheckboxStatus = "checked" | "indeterminate" | "unchecked";

export const DRIZZLE_DB_CONFIG: DrizzleConfig<Record<string, never>> = {
    casing: "snake_case",
};

export const NO_SELECTION_LABEL = "Keine Auswahl";

export const SQL_BLOB_SIZE = 65_535;

/** Other */
/** Alpha-numeric chars, `_`, `-` and `.` */
export const SECURE_STORAGE_KEY_REGEX: RegExp = /^[\w\-_\.]*$/;
export const SECURE_STORAGE_MAX_VALUE_LENGTH: number = 2048;

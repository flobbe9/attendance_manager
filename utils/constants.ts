import { LogLevelName } from "@/abstract/LogLevel";
import { DrizzleConfig } from "drizzle-orm";

export const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION;
export const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME;
export const LOG_LEVEL = process.env.EXPO_PUBLIC_LOG_LEVEL;

// Custom log
export const LOG_LEVEL_COLORS: Record<LogLevelName, string> = {
    "INFO": "white",
    "WARN": "rgb(255, 233, 174)",
    "ERROR": "rgb(255, 230, 230)",
    "DEBUG": "rgb(230, 230, 230)",
    "TRACE": "rgb(170, 210, 255)"
}

/** Dont log to console if the 'message' contains one of these strings */
export const CONSOLE_MESSAGES_TO_AVOID: (string | number)[] = [
    "Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle."
];

/**
 * @see Checkbox from 'react-native-paper'
 */
export type CheckboxStatus = "checked" | "indeterminate" | "unchecked";

export const DRIZZLE_DB_CONFIG: DrizzleConfig<Record<string, never>>  = {
    casing: 'snake_case',
}
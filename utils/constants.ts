import { LogLevelName } from "@/abstract/LogLevel";
import { env } from "./processEnv";

export const APP_VERSION = "0.0.1";

export const DATABASE_NAME = env("DATABASE_NAME");
export const LOG_LEVEL = env("LOG_LEVEL");

// Custom log
export const LOG_LEVEL_COLORS: Record<LogLevelName, string> = {
    "INFO": "white",
    "WARN": "rgb(255, 233, 174)",
    "ERROR": "rgb(255, 230, 230)",
    "DEBUG": "white"
}

/** Dont log to console if the 'message' contains one of these strings */
export const CONSOLE_MESSAGES_TO_AVOID: (string | number)[] = [];

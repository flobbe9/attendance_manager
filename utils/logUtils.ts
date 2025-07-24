import { CustomExceptionFormat } from "@/abstract/CustomExceptionFormat";
import { LogLevel, logLevelToString } from "@/abstract/LogLevel";
import { getTimeStamp, includesIgnoreCaseTrim } from "@/utils/utils";
import { ColorValue } from "react-native";
import { CONSOLE_MESSAGES_TO_AVOID, ENV, LOG_LEVEL, LOG_LEVEL_COLORS } from "./constants";

export function logError(message?: any, ...optionalParams: any[]): void {
	if (!isLogLevel(LogLevel.ERROR)) return;

	if (typeof message === 'string')
		console.error(getLogStartOfLine(LogLevel.ERROR), message, ...optionalParams);

	else 
        console.error(getLogStartOfLine(LogLevel.ERROR), message, ...optionalParams);
}

export function logWarn(message?: any, ...optionalParams: any[]): void {
	if (!isLogLevel(LogLevel.WARN)) return;

	if (typeof message === 'string')
		console.warn(getLogStartOfLine(LogLevel.WARN), message, ...optionalParams);

	else 
        console.warn(getLogStartOfLine(LogLevel.WARN), message, ...optionalParams);
}

export function log(message?: any, ...optionalParams: any[]): void {
	if (!isLogLevel(LogLevel.INFO)) return;

	if (typeof message === 'string')
		logColored(LOG_LEVEL_COLORS[LogLevel.INFO], getLogStartOfLine(LogLevel.INFO), message, ...optionalParams);

	else 
        logColored(LOG_LEVEL_COLORS[LogLevel.INFO], getLogStartOfLine(LogLevel.INFO), message, ...optionalParams);
}

export function logDebug(message?: any, ...optionalParams: any[]): void {
	if (!isLogLevel(LogLevel.DEBUG)) return;

	if (typeof message === 'string')
		logColored(LOG_LEVEL_COLORS[LogLevel.DEBUG], getLogStartOfLine(LogLevel.DEBUG), message, ...optionalParams);

	else 
        logColored(LOG_LEVEL_COLORS[LogLevel.DEBUG], getLogStartOfLine(LogLevel.DEBUG), message, ...optionalParams);
}

export function logTrace(message?: any, ...optionalParams: any[]): void {
	if (!isLogLevel(LogLevel.TRACE)) return;

	if (typeof message === 'string')
		logColored(LOG_LEVEL_COLORS[LogLevel.TRACE], getLogStartOfLine(LogLevel.TRACE), message, ...optionalParams);

	else 
        logColored(LOG_LEVEL_COLORS[LogLevel.TRACE], getLogStartOfLine(LogLevel.TRACE), message, ...optionalParams);
}

export function logWarnFiltered(message?: any, ...optionalParams: any[]): void {
    logFiltered(LogLevel.WARN, message, ...optionalParams);
}

export function logErrorFiltered(message?: any, ...optionalParams: any[]): void {
    logFiltered(LogLevel.ERROR, message, ...optionalParams);
}

/**
 * Dont log given ```obj``` if it contains one of {@link CONSOLE_MESSAGES_TO_AVOID}s strings. Log normally if ```obj``` is not
 * of type ```string```, ```number``` or ```Error```.
 * 
 * @param logLevelName of obj to choose text background color
 * @param obj to filter before logging
 * @param optionalParams 
 */
function logFiltered(logLevelName: LogLevel, obj?: any, ...optionalParams: any[]): void {

    let messageToCheck = obj;

    // case: cannot filter obj
    if (!messageToCheck || (typeof messageToCheck !== "string" && typeof messageToCheck !== "number" && !(messageToCheck instanceof Error))) {
       console.log(messageToCheck, ...optionalParams);
       return;
    }

    // case: Error
    if (obj instanceof Error)
        messageToCheck = obj.stack;

    // compare to avoid messages
    for (const messageToAvoid of CONSOLE_MESSAGES_TO_AVOID) 
        // case: avoid obj
        if (includesIgnoreCaseTrim(messageToCheck, messageToAvoid)) 
            return; 
        
    logColored(LOG_LEVEL_COLORS[logLevelName], messageToCheck, ...optionalParams);
}

/**
 * NOTE: Don't use custom logs here, since the default ```console.log``` metods are overriden with this an must work independently from LogLevel.
 *  
 * @param backgroundColor only applied to `obj` arg
 * @param obj to log colored
 * @param optionalParams to log non-colored
 */
function logColored(backgroundColor: ColorValue, obj?: any, ...optionalParams: any[]): void {

    const params = [`%c${obj}`, "background: " + backgroundColor.toString(), ...optionalParams];
    console.log(...params);
}

/**
 * Log the all props of given {@link CustomExceptionFormat} response and include the stacktrace.
 * 
 * @param response idealy formatted as {@link CustomExceptionFormat}
 */
export function logApiResponse(response: CustomExceptionFormat): void {

    logError(response.timestamp + " (" + response.status + "): " + response.message + (response.path ? " " + response.path : ""));
}

/**
 * Indicates whether `expectedLogLevel` is matching {@link LOG_LEVEL}, meaning that logs with that level would
 * be enabled.
 * 
 * @param expectedLogLevel 
 * @returns `true` if `expectedLogLevel` ordianl value is less than equal {@link LOG_LEVEL}
 */
function isLogLevel(expectedLogLevel: LogLevel): boolean {
    return LOG_LEVEL >= expectedLogLevel;
}


/**
 * @returns ```false``` if {@link NODE_ENV} is "production"
 */
export function isDebugLogLevel(): boolean {
    if ("production" === ENV) {
        logWarn("Cannot log at 'DEBUG' level in 'production'");
        return false;
    }

    return isLogLevel(LogLevel.DEBUG);
}


export function isTraceLogLevel(): boolean {
    if ("production" === ENV) {
        logWarn("Cannot log at 'TRACE' level in 'production'");
        return false;
    }

    return isLogLevel(LogLevel.TRACE);
}

/**
 * Log the timestamp and log level before every log entry.
 *
 * @param logLevel
 * @returns the string the log entry should start with
 */
function getLogStartOfLine(logLevel: LogLevel): string {
	if (!isLogLevel(logLevel)) return `${getTimeStamp()}`;

	return `${getTimeStamp()} ${logLevelToString(logLevel)}`;
}
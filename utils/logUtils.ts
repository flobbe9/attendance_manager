import { CustomExceptionFormat } from "@/abstract/CustomExceptionFormat";
import { CONSOLE_MESSAGES_TO_AVOID, LOG_LEVEL, LOG_LEVEL_COLORS } from "./constants";
import { getTimeStamp, includesIgnoreCaseTrim } from "@/utils/utils";
import { logLevelDef, LogLevelName } from "@/abstract/LogLevel";

export function log(message?: any, ...optionalParams: any[]): void {

    if (!isInfoLogLevel())
        return;

    console.log(message, ...optionalParams);
}


export function logDebug(message?: any, ...optionalParams: any[]): void {

    if (!isDebugLogLevel())
        return;

    const errorObj = typeof message === "string" ? new Error(message) : new Error("<no message>");
    
    console.log(getTimeStamp(), errorObj, ...optionalParams);
}


export function logWarn(message?: any, ...optionalParams: any[]): void {
    
    if (!isWarnLogLevel())
        return;

    const errorObj = typeof message === "string" ? new Error(message) : new Error("<no message>");

    console.warn(getTimeStamp(), errorObj, errorObj.stack, ...optionalParams);
}


export function logWarnFiltered(message?: any, ...optionalParams: any[]): void {

    logFiltered("WARN", message, ...optionalParams);
}


export function logError(message?: any, ...optionalParams: any[]): void {

    if (!isErrorLogLevel())
        return;

    const errorObj = typeof message === "string" ? new Error(message) : new Error("<no message>");

    console.error(getTimeStamp(), errorObj, errorObj.stack, ...optionalParams);
}


export function logErrorFiltered(message?: any, ...optionalParams: any[]): void {

    logFiltered("ERROR", message, ...optionalParams);
}


/**
 * Dont log given ```obj``` if it contains one of {@link CONSOLE_MESSAGES_TO_AVOID}s strings. Log normally if ```obj``` is not
 * of type ```string```, ```number``` or ```Error```.
 * 
 * @param logLevelName of obj to choose text background color
 * @param obj to filter before logging
 * @param optionalParams 
 */
function logFiltered(logLevelName: LogLevelName, obj?: any, ...optionalParams: any[]): void {

    let messageToCheck = obj;

    // case: cannot filter obj
    if (!obj || (typeof obj !== "string" && typeof obj !== "number" && !(obj instanceof Error))) {
       logColored(logLevelName, obj, ...optionalParams);
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
        
    logColored(logLevelName, messageToCheck, ...optionalParams);
}


/**
 * Don't use custom logs here, since the default ```console.log``` metods are overriden with this an must work independently from LogLevel.
 *  
 * @param logLevelName 
 * @param obj 
 * @param optionalParams 
 */
function logColored(logLevelName: LogLevelName, obj?: any, ...optionalParams: any[]): void {

    // get log color by sevirity
    const color = LOG_LEVEL_COLORS[logLevelName];

    console.log("%c" + obj, "background: " + color, ...optionalParams);
}


/**
 * Log the all props of given {@link CustomExceptionFormat} response and include the stacktrace.
 * 
 * @param response idealy formatted as {@link CustomExceptionFormat}
 */
export function logApiResponse(response: CustomExceptionFormat): void {

    logError(response.timestamp + " (" + response.status + "): " + response.message + (response.path ? " " + response.path : ""));
}


export function isLogLevelName(name: string | undefined | null): name is LogLevelName {

    return !!name && Object.keys(logLevelDef).includes(name);
}


function isLogLevel(expectedLogLevel: LogLevelName): boolean {

    if (!isLogLevelName(LOG_LEVEL)) {
        // don't use custom log method here since they depend on a valid LOG_LEVEL
        console.error("Invalid 'LOG_LEVEL'");
        return false;
    }

    return logLevelDef[LOG_LEVEL] >= logLevelDef[expectedLogLevel];
}


export function isErrorLogLevel(): boolean {

    return isLogLevel("ERROR");
}


export function isWarnLogLevel(): boolean {

    return isLogLevel("WARN");
}


export function isInfoLogLevel(): boolean {

    return isLogLevel("INFO");
}


/**
 * @returns ```false``` if {@link NODE_ENV} is "production"
 */
export function isDebugLogLevel(): boolean {

    if ("production" === process.env.NODE_ENV) {
        logWarn("Cannot log at 'DEBUG' level in 'production'");
        return false;
    }

    return isLogLevel("DEBUG");
}
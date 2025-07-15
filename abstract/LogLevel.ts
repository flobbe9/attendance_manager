/**
 * NOTE: order of values represents priority, dont change.
 * @since 0.0.4
 * @see 'logUtils.ts'
 */
export enum LogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE
}

const logLevelNames = {
    [LogLevel.ERROR]: "ERROR",
    [LogLevel.WARN]: "WARN",
    [LogLevel.INFO]: "INFO",
    [LogLevel.DEBUG]: "DEBUG",
    [LogLevel.TRACE]: "TRACE"
}

export function logLevelToString(logLevel: LogLevel): string {
    return logLevelNames[logLevel];
}
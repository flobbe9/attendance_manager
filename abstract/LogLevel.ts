/**
 * @since 0.0.4
 * @see 'logUtils.ts'
 */


export const logLevelDef = {
    "ERROR": 0,
    "WARN": 1,
    "INFO": 2,
    "DEBUG": 3,
    "TRACE": 4
}


export type LogLevelName = keyof typeof logLevelDef;



/**
 * Serves as replacement for ```process.env``` since that one does not really work in react native.
 * 
 * @param envKey name of the env variable. Case sensitive
 * @returns the value of given ```envKey``` if present or ```undefined```
 */
export function env(envKey: string): any {

    const development = {
        DATABASE_NAME: "attendance_manager",
        LOG_LEVEL: "DEBUG"
    }
    
    const production = {
        DATABASE_NAME: "attendance_manager",
        LOG_LEVEL: "INFO"
    }

    if (process.env.NODE_ENV === "development")
        return development[envKey];

    return production[envKey];
}
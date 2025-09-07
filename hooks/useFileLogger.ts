import { logLevelToString } from "@/abstract/LogLevel";
import { APP_NAME, ENV, FILE_LOGGER_ENABLED, FILE_LOGGER_MAIL_TO, LOG_LEVEL } from "@/utils/constants";
import { logDebug, logError, logInfo } from "@/utils/logUtils";
import { Platform } from "react-native";
import { ConfigureOptions, FileLogger } from "react-native-file-logger";

/**
 * Use `adb` command (on android at least) to pull and modify log files.
 *
 * @since 0.2.2
 * @see https://www.npmjs.com/package/react-native-file-logger
 */
export function useFileLogger() {
    /**
     * Configure the file logger. Logelevel and log format are not modified, any `console` log
     * is captured. Using default values mostly, so log files stay 5 days, one file per day, max file size is 1MB.
     *
     * Should be called once only on app start.
     */
    async function initializeFileLogger(): Promise<void> {
        if (!isFileLoggerEnabled()) return;

        const config: ConfigureOptions = {
            formatter: (level, msg) => `${msg}`,
        };

        try {
            await FileLogger.configure(config);
            logInfo("Initialized file logger with", config);
        } catch (e) {
            logError("Failed to initialize file logger", e);
        } finally {
            logInfo("Current log files:", await FileLogger.getLogFilePaths());
        }
    }

    /**
     * Triggers a native share popup (on android at least, dont know about ios) to send all log files.
     *
     * Wont delete zip files created by sendMail method.
     */
    async function shareLogFiles(): Promise<void> {
        if (!isFileLoggerEnabled()) return;

        const mailBody = `OS: ${Platform.OS}\nENV: ${ENV}\nLOG_LEVEL: ${logLevelToString(LOG_LEVEL)}`;

        // log mail body because sharing with a different method than email wont send the "body"
        logDebug(`Sharing log files: ${mailBody}`);

        try {
            await FileLogger.sendLogFilesByEmail({
                body: mailBody,
                to: FILE_LOGGER_MAIL_TO,
                subject: `Log files for ${APP_NAME}`,
            });
        } catch (e) {
            logError("Failed to share log files", e);
        }
    }

    /**
     * Delete all log files except the current. Not sure if zip files are deleted as well.
     */
    async function deleteLogFiles(): Promise<void> {
        if (!isFileLoggerEnabled()) return;

        try {
            await FileLogger.deleteLogFiles();
            logInfo("Deleted log files");
        } catch (e) {
            logError("Failed to delete log files. This might be because there aren't more than 1 files", e);
        }
    }

    function isFileLoggerEnabled(): boolean {
        return ENV !== "production" && FILE_LOGGER_ENABLED;
    }

    return {
        initializeFileLogger,
        shareLogFiles,
        deleteLogFiles,
        isFileLoggerEnabled,
    };
}

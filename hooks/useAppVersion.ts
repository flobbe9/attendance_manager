import { appJson, ENV } from "@/utils/constants";
import { logError } from "@/utils/logUtils";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { CheckVersionResponse, checkVersion } from "react-native-check-version";

/**
 * Fetch information about this app's version from platform specific app store.
 * 
 * @returns 
 */
export function useAppVersionInfo() {
    const [appVersionInfo, setAppVersionInfo] = useState<CheckVersionResponse>();
    const [canUpdateAppVersion, setCanUpdateAppVersion] = useState(false);

    useEffect(() => {
        handleRender();
    }, []);
    
    async function handleRender(): Promise<void> {
        const appVersionInfo = await fetchVersionInfo();
        setAppVersionInfo(appVersionInfo);
        setCanUpdateAppVersion("production" === ENV && appVersionInfo?.needsUpdate);
    }
    
    /**
     * Don't fetch if not in `production` environment.
     * 
     * @returns version info containing detail about possible newer versions, or `null` if fetch failed
     */
    async function fetchVersionInfo(): Promise<CheckVersionResponse | null> {
        if ("production" !== ENV)
            return null;

        try {
            const versionInfo = await checkVersion({
                bundleId: Platform.OS === "android" ? appJson.android.package : appJson.ios.bundleIdentifier,
            });
    
            if (versionInfo.error) throw versionInfo.error;
        } catch (e) {
            logError(e.message);
            return null;
        }
    }

    return {
        /** `CheckVersionResponse` state, `undefined` while fetching or `null` if no version info available */
        appVersionInfo,
        /** Whether this app can be updated by the user in the app store. Default is `false` (while fetching) */
        canUpdateAppVersion
    }
}
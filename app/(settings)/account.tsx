import { GlobalContext } from "@/components/context/GlobalContextProvider";
import B from "@/components/helpers/B";
import Br from "@/components/helpers/Br";
import HelperButton from "@/components/helpers/HelperButton";
import HelperInput from "@/components/helpers/HelperInput";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { logDebug } from "@/utils/logUtils";
import { FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";
import { useContext, useState } from "react";
import { CloudStorage, CloudStorageProvider, CloudStorageScope, useCloudFile } from "react-native-cloud-storage";
import { useIsCloudAvailable } from "react-native-cloud-storage";

/**
 * @since latest
 */
export default function account() {
    const { snackbar } = useContext(GlobalContext);

    const [cloudStorage, ] = useState(new CloudStorage(new CloudStorage().getProvider(), {strictFilenames: true}));

    const [fileContent, setFileContent] = useState("");

    const filePath = "/test.txt";
    const scope = CloudStorageScope.Documents;
    const { content, read, write, remove } = useCloudFile(filePath, scope, cloudStorage);
    const isCloudAvailable = useIsCloudAvailable();

    async function handleWrite(): Promise<void> {
        logDebug(`write ${filePath}`);

        await write(fileContent ?? `no file content found`);

        snackbar(`Wrote '${fileContent}' to ${filePath}`);
    }

    async function handleRead(): Promise<void> {
        logDebug(`read ${filePath}`);

        await read(); // update content state

        snackbar("Current file content: " + content);
    }

    async function handleDelete(): Promise<void> {
        logDebug(`delete ${filePath}`);

        await remove();

        snackbar(`Deleted ${filePath}: ` + content === null);
    }

    async function syncDevices(): Promise<void> {
        await cloudStorage.triggerSync(filePath, scope);
    }

    return (
        <ScreenWrapper>
            <HelperScrollView style={{ padding: GLOBAL_SCREEN_PADDING }}>
                <B style={{ fontSize: FONT_SIZE }}>Info... TODO</B>

                <B style={{ fontSize: FONT_SIZE }}>Geräte synchronisieren</B>

                <HelperView rendered={isCloudAvailable}>
                    <HelperButton onPress={handleWrite}>Write to {filePath}</HelperButton>
                    <HelperInput value={fileContent} setValue={setFileContent} />

                    <HelperButton onPress={handleRead}>Read from {filePath}</HelperButton>

                    <HelperButton onPress={handleDelete}>Delete {filePath}</HelperButton>

                    <HelperButton onPress={syncDevices}>Sync devices</HelperButton>
                </HelperView>

                <HelperText rendered={!isCloudAvailable}>
                    Cloud unavailable...
                    <Br />
                    Default provider: {cloudStorage.getProvider()}
                </HelperText>
            </HelperScrollView>
        </ScreenWrapper>
    );
}

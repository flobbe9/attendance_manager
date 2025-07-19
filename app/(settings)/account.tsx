import B from "@/components/helpers/B";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import { FONT_SIZE, GLOBAL_SCREEN_PADDING } from "@/utils/styleConstants";

/**
 * @since latest
 */
export default function account() {

    return (
        <ScreenWrapper>
            <HelperScrollView style={{ padding: GLOBAL_SCREEN_PADDING }}>
                <B style={{ fontSize: FONT_SIZE }}>Info... TODO</B>

                <B style={{ fontSize: FONT_SIZE }}>Geräte synchronisieren</B>
            </HelperScrollView>
        </ScreenWrapper>
    );
}
import B from "@/components/helpers/B";
import Flex from "@/components/helpers/Flex";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import ScreenWrapper from "@/components/helpers/ScreenWrapper";
import {useResponsiveStyles} from "@/hooks/useResponsiveStyles";
import {APP_VERSION} from "@/utils/constants";
import {GLOBAL_SCREEN_PADDING} from "@/utils/styleConstants";

import React from "react";

/**
 * Contains "about" content like version etc.
 *
 * @since 0.1.0
 */
export default function appInfo() {
    const {
        allStyles: {col_6},
    } = useResponsiveStyles();

    return (
        <ScreenWrapper>
            <HelperScrollView style={{padding: GLOBAL_SCREEN_PADDING + 20}}>
                <Flex>
                    <B style={{...col_6}}>Version:</B>

                    <HelperText style={{...col_6}}>{APP_VERSION}</HelperText>
                </Flex>
            </HelperScrollView>
        </ScreenWrapper>
    );
}

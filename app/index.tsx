import { AttendanceIndexStyles } from "@/assets/styles/AttendanceIndexStyles";
import { AttendanceLinkStyles } from "@/assets/styles/AttendanceLinkStyles";
import AttendanceLink from "@/components/AttendanceLink";
import ExtendableButton from "@/components/helpers/ExtendableButton";
import Flex from "@/components/helpers/Flex";
import HelperButton from "@/components/helpers/HelperButton";
import HelperScrollView from "@/components/helpers/HelperScrollView";
import HelperText from "@/components/helpers/HelperText";
import HelperView from "@/components/helpers/HelperView";
import { useAnimatedStyle } from "@/hooks/useAnimatedStyle";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { log } from "@/utils/logUtils";
import { GLOBAL_SCREEN_PADDING, HISTORY_COLOR, HISTORY_COLOR_TRANSPARENT, MUSIC_COLOR } from "@/utils/styleConstants";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


/**
 * @since 0.0.1
 */
export default function index() {

    const [isExtended, setIsExtended] = useState(true);
    
    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        
        setIsExtended(currentScrollPosition <= 0);
    };


    const { allStyles: { px_5 }} = useResponsiveStyles();


    const fabStyle = { ['right']: 16 };

    return (
        <SafeAreaView>
            <HelperView dynamicStyle={AttendanceIndexStyles.component}>
                <Flex justifyContent="flex-end" style={{paddingBottom: GLOBAL_SCREEN_PADDING}}>
                    <HelperText>Erledigt:</HelperText>

                    <Flex 
                        style={{
                            marginStart: 10
                        }}
                        alignItems="center"
                    >
                        <FontAwesome
                            style={{
                                color: MUSIC_COLOR,
                            }}
                            name="user" 
                        />
                        <HelperText>1/9</HelperText>
                    </Flex>

                    <Flex 
                        style={{
                            marginStart: 10
                        }}
                        alignItems="center"
                    >
                        <FontAwesome
                            style={{
                                color: HISTORY_COLOR,
                            }}
                            name="user" 
                        />
                        <HelperText>2/9</HelperText>
                    </Flex>

                    <Flex 
                        style={{
                            marginStart: 10
                        }}
                        alignItems="center"
                    >
                        <FontAwesome
                            style={{
                                color: "black",
                            }}
                            name="user" 
                        />
                        <HelperText>2/8</HelperText>
                    </Flex>
                </Flex>

                <HelperScrollView onScroll={handleScroll}>
                    {[
                        <AttendanceLink
                            key={0} 
                            dynamicStyle={AttendanceIndexStyles.link} 
                            subject="Musik"
                            date={new Date()}
                        >
                            <FontAwesome
                                style={{
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                            <FontAwesome
                                style={{    
                                    color: MUSIC_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={1} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                                backgroundColor: HISTORY_COLOR_TRANSPARENT,
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                            <FontAwesome
                                style={{
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                            <FontAwesome
                                style={{    
                                    color: MUSIC_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={2} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={3} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={4} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={5} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={6} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={7} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>,
                        <AttendanceLink
                            key={8} 
                            dynamicStyle={AttendanceIndexStyles.link}
                            style={{
                            }}
                            subject="Geschichte"
                        >
                            <FontAwesome
                                style={{    
                                    color: HISTORY_COLOR,
                                    ...AttendanceLinkStyles.icon,
                                }}
                                name="user" 
                            />
                        </AttendanceLink>
                    ]}
                </HelperScrollView>

                <Link href={"/(attendance)"} asChild>
                    <ExtendableButton 
                        isExtended={isExtended}
                        dynamicStyle={AttendanceIndexStyles.addButton}
                        containerStyles={AttendanceIndexStyles.addButtonOuterView}
                        align="flex-end"
                        extendedWidth={152}
                        disabled
                        label={<HelperText dynamicStyle={AttendanceIndexStyles.addButtonLabel}>Neuer UB</HelperText>}
                    >
                        <FontAwesome name="plus" style={AttendanceIndexStyles.buttonIcon} />
                    </ExtendableButton>
                </Link>
            </HelperView>
        </SafeAreaView>
    )
}
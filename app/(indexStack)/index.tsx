import { useBackHandler } from '@/hooks/useBackHandler';
import { logDebug } from '@/utils/logUtils';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import Index from '../index';

/**
 * Exists only to satisfy expo navigation convetions.
 * 
 * @returns the root index content
 * @since 0.2.4
 */
export default function index() {
    const navigation = useNavigation();
    const router = useRouter();
    const isFocused = useIsFocused();

    // make sure the root index screen is never visited
    useBackHandler(() => {
        navigation.goBack();
        return false;
    })
    useEffect(() => {
        router.navigate("/(indexStack)");
    }, [isFocused]);

    return <Index />;
}
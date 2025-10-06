import { useBackHandler } from '@/hooks/useBackHandler';
import { useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import Index from './(indexStack)/index';

/**
 * Exists only to satisfy expo navigation convetions.
 * 
 * @returns the root index content
 * @since 0.2.4
 */
export default function index() {
    const navigation = useNavigation();
    const router = useRouter();
    const pathNames = useSegments();

    useBackHandler(() => {
        // case: is index view
        if (pathNames.length <= 1)
            // make sure the root index screen is never visited
            navigation.goBack();

        return false;
    })

    useEffect(() => {
        router.navigate("/(indexStack)");
    }, []);

    return <Index />;
}
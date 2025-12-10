import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import Hero from '@/components/interfaces/hero';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_OPTIONS = {
    light: {
        title: 'Devanthos',
        headerTransparent: true,
        headerShadowVisible: true,
        headerStyle: { backgroundColor: THEME.light.background },
        headerRight: () => <ThemeToggle />,
    },
    dark: {
        title: 'Devanthos',
        headerTransparent: true,
        headerShadowVisible: true,
        headerStyle: { backgroundColor: THEME.dark.background },
        headerRight: () => <ThemeToggle />,
    },
};

export default function Screen() {
    const { colorScheme } = useColorScheme();

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
            <SafeAreaView className="flex-1 bg-background">
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="pb-8"
                    showsVerticalScrollIndicator={false}>
                    <Hero />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
};

function ThemeToggle() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <Button
            onPressIn={toggleColorScheme}
            size="icon"
            variant="ghost"
            className="rounded-full web:mx-4">
            <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
        </Button>
    );
}

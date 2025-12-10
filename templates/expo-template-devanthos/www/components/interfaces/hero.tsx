import React from 'react';
import { View } from 'react-native';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { ArrowRight, Code2, Rocket } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

type LogoConfig = {
    uri: string;
    position: string;
    scale?: number;
};

const LEFT_LOGOS: LogoConfig[] = [
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-3.svg',
        position: 'right-0 -bottom-5',
        scale: 0.6,
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-20.svg',
        position: 'right-24 bottom-1',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-6.svg',
        position: 'right-44 bottom-7',
        scale: 0.6,
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-8.svg',
        position: 'right-44 bottom-28',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-9.svg',
        position: 'left-24 bottom-4',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-21.svg',
        position: 'left-20 bottom-24',
        scale: 0.6,
    },
];

const RIGHT_LOGOS: LogoConfig[] = [
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-12.svg',
        position: 'left-0 -bottom-5',
        scale: 0.6,
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-13.svg',
        position: 'left-24 bottom-1',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-14.svg',
        position: 'left-44 bottom-7',
        scale: 0.6,
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-15.svg',
        position: 'left-44 bottom-28',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-17.svg',
        position: 'right-24 bottom-4',
    },
    {
        uri: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/integration/integration-19.svg',
        position: 'right-20 bottom-24',
        scale: 0.6,
    },
];

type LogoBubbleProps = LogoConfig & {
    fill: string;
};

function LogoBubble({ uri, position, scale = 1, fill }: LogoBubbleProps) {
    return (
        <View
            className={cn(
                'absolute flex size-20 items-center justify-center rounded-full border border-border p-4',
                position
            )}
            style={scale !== 1 ? { transform: [{ scale }] } : undefined}>
            <SvgUri uri={uri} width="100%" height="100%" fill={fill} />
        </View>
    );
}

export default function Hero() {
    const { colorScheme } = useColorScheme();
    const logoFill = colorScheme === 'dark' ? '#f1f5f9' : '#0f172a';

    return (
        <View className="overflow-hidden py-32">
            <View className="container relative mx-auto px-4">
                <View className="mb-6 text-center">
                    <View className="inline-flex flex-row items-center gap-2 self-center rounded-full bg-primary/10 px-4 py-2">
                        <Icon as={Code2} size={16} className="text-primary" />
                        <Text className="text-sm font-medium text-primary">
                            Plantilla Expo - Devanthos
                        </Text>
                    </View>
                </View>
                <Text
                    variant="h1"
                    className="mx-auto max-w-4xl text-center text-foreground lg:text-6xl">
                    Plantilla Expo{'\n'}Lista para usar
                </Text>
                <Text className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground lg:mt-10">
                    Plantilla moderna de Expo con NativeWind y componentes UI. Integra nuevas
                    secciones directamente en el archivo <Text variant="code">app/index.tsx</Text>
                </Text>
                <View className="relative z-10 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-16">
                    <Button size="lg" className="min-w-[200px]">
                        <Icon as={Rocket} size={16} className="mr-2" />
                        <Text>Comenzar</Text>
                        <Icon as={ArrowRight} size={16} className="ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" className="min-w-[200px]">
                        <Text>Ver Documentación</Text>
                    </Button>
                </View>
                <View className="inset-0 -z-10 flex justify-center lg:absolute">
                    <View className="relative -top-8 flex justify-between sm:-top-20 lg:-top-0 lg:w-full">
                        <View className="relative -left-20 min-h-44 min-w-[460px] translate-x-28 sm:translate-x-0 lg:min-h-[292px] lg:scale-90 xl:scale-100">
                            {LEFT_LOGOS.map((logo) => (
                                <LogoBubble key={logo.uri} {...logo} fill={logoFill} />
                            ))}
                        </View>
                        <View className="relative -right-20 min-h-44 min-w-[460px] -translate-x-28 sm:translate-x-0 lg:min-h-[292px] lg:scale-90 xl:scale-100">
                            {RIGHT_LOGOS.map((logo) => (
                                <LogoBubble key={logo.uri} {...logo} fill={logoFill} />
                            ))}
                        </View>
                        <View className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
                    </View>
                </View>
            </View>
        </View>
    );
}

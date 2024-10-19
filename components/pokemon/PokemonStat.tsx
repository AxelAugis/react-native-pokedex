import { StyleSheet, View, ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/reanimated2/component/View";
import { useEffect } from "react";

type Props = ViewProps & {
    color: string,
    name: string, 
    value: number
}

function statShortName(name: string) {
    return name.replaceAll("special", "sp").replaceAll("defense", "def").replaceAll("attack", "atk").replaceAll("speed", "spd").replaceAll("hp", "hp").toUpperCase();
};

export function PokemonStat({style, color, name, value, ...rest}: Props) {
    const colors = useThemeColors();
    const sharedValue = useSharedValue(value);
    const barInnerStyle = useAnimatedStyle(() => {
        return {
            flex: sharedValue.value,
        }
    });

    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: 255 - sharedValue.value,
        }
    });

    useEffect(() => {
        sharedValue.value = withSpring(value, {damping: 10, stiffness: 100});
    }, [value]);

    return (
        <Row style={[style, styles.root]} {...rest} gap={8}>
            <View style={[styles.name, {borderColor: colors.grayLight}]}>
                <ThemedText variant="subtitle3" style={{color: color}}>{statShortName(name)}</ThemedText>
            </View>
            <View style={styles.number}>
                <ThemedText>{value.toString().padStart(3, '0')}</ThemedText>
            </View>
            <Row style={styles.bar} gap={0}>
                <Animated.View style={[styles.barInner, {backgroundColor: color }, barInnerStyle]} />
                <Animated.View style={[styles.barBackground, barBackgroundStyle]} />
            </Row>
        </Row>
    )
}

const styles = StyleSheet.create({
    root: {

    },
    name: {
        width: 50,
        paddingRight: 8,
        borderRightWidth: 1,
        borderStyle: 'solid',
    },
    number: {
        width: 23,
    },
    bar: {
        borderRadius: 20,
        height: 4,
        overflow: 'hidden',
        flex: 1,
        flexDirection: 'row-reverse',
    },
    barInner: {
        height: 4,
    },
    barBackground: {
        height: 4,
        opacity: 0.25,
        flex: 1,
    }
})
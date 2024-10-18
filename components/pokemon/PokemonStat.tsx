import { StyleSheet, View, ViewProps } from "react-native";
import { Row } from "../Row";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps & {
    color: string,
    name: string, 
    value: number
}

export function PokemonStat({style, color, name, value, ...rest}: Props) {
    const colors = useThemeColors();
    return (
        <Row style={[style, styles.root]} {...rest} gap={8}>
            <View style={[styles.name, {borderColor: colors.grayLight}]}>
                <ThemedText variant="subtitle3" style={{color: color}}>{name}</ThemedText>
            </View>
            <View style={styles.number}>
                <ThemedText>{value.toString().padStart(3, '0')}</ThemedText>
            </View>
            <Row style={styles.bar}>
                <View style={[styles.barInner, { flex: value / 100, backgroundColor: color }]} />
                <View style={[styles.barBackground, { backgroundColor: color }]} />
            </Row>
        </Row>
    )
}

const styles = StyleSheet.create({
    root: {

    },
    name: {
        width: 31,
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
        backgroundColor: "red",
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
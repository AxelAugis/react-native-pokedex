import { Card } from "@/components/Card";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";


export default function Pokemon({}) {

    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string}
    const { data:pokemon } = useFetchQuery("/pokemon/[id]", {id: params.id})
    const mainType = pokemon?.types?.[0]?.type?.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;

    return (
        <RootView style={{backgroundColor: colorType}}>
            <View>
                <Image style={styles.pokeball} source={require('@/assets/images/big_pokeball.png')} width={208} height={208} />
            </View>
            <Row style={styles.header} gap={12}>
                <Pressable onPress={router.back}>
                    <Row gap={8}>
                        <Image source={require('@/assets/images/back.png')} width={32} height={32} />
                        <ThemedText color="grayWhite" variant="headline" style={{textTransform: 'capitalize'}}>{pokemon?.name }</ThemedText>
                    </Row>
                </Pressable>
                <ThemedText color="grayWhite" variant="subtitle2">#{params.id.padStart(3, '0')}</ThemedText>
            </Row>
            <View style={styles.body}>
                <Image 
                    style={styles.artwork}
                    source={{
                        uri: getPokemonArtwork(params.id)
                    }} 
                    width={200} 
                    height={200} 
                />
                <Card style={styles.card}>
                    <ThemedText>Bonjour les gens</ThemedText>
                </Card>
            </View>
           
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pokeball: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: -1
    },
    artwork: {
        position: 'absolute',
        top: -140,
        zIndex: 2,
        alignSelf: 'center',
    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
    }
})
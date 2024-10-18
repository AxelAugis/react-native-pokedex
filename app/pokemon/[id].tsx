import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";


export default function Pokemon({}) {

    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string}
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", {id: params.id})
    const { data: species } = useFetchQuery("/pokemon-species/[id]", {id: params.id})
    const mainType = pokemon?.types?.[0]?.type?.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name === 'en')
        ?.flavor_text.replaceAll("\n", ". ");

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
                    <Row gap={16}>
                        {
                            types.map((type) => (<PokemonType key={type.type.name} name={type.type.name} />
                        ))}
                    </Row>
                    <ThemedText variant="subtitle1" style={{ color: colorType }}>About</ThemedText>
                    <Row gap={16}>
                        <PokemonSpec
                        style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight}} title={formatWeight(pokemon?.weight)} description="Weight" image={require('@/assets/images/weight.png')} />
                        <PokemonSpec
                        style={{borderStyle: 'solid', borderRightWidth: 1, borderColor: colors.grayLight}} title={formatSize(pokemon?.height)} description="Size" image={require('@/assets/images/height.png')} />
                        <PokemonSpec 
                            title={pokemon?.moves
                            .slice(0, 2)
                            .map(m => m.move.name)
                            .join("\n")} 
                            description="Moves"  />
                    </Row>
                    <ThemedText>{bio}</ThemedText>
                    <ThemedText variant="subtitle1" style={{ color: colorType }}>Base stats</ThemedText>
                    <View style={{alignSelf: 'stretch'}}>
                        <PokemonStat color={colorType} name="HP" value={45} />
                        <PokemonStat color={colorType} name="HP" value={45} />
                        <PokemonStat color={colorType} name="HP" value={45} />
                        <PokemonStat color={colorType} name="HP" value={45} />
                        <PokemonStat color={colorType} name="HP" value={45} />

                    </View>
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
        alignItems: 'center',
        gap: 16,
    }
})
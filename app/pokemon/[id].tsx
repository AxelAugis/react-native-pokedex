import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { basePokemonStats, formatSize, formatWeight, getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";


export default function Pokemon({}) {

    const colors = useThemeColors();
    const params = useLocalSearchParams() as {id: string}
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", {id: params.id})
    const { data: species } = useFetchQuery("/pokemon-species/[id]", {id: params.id})
    const id = parseInt(params.id, 10);
    const mainType = pokemon?.types?.[0]?.type?.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const stats = pokemon?.stats ?? basePokemonStats;
    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name === 'en')
        ?.flavor_text.replaceAll("\n", "");

        const enableAudio = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
            });
        };
        
        const onImagePress = async () => {
            const cry = pokemon?.cries.latest;
            if (!cry) {
                return;
            } else {
                try {
                    await enableAudio();
                    const { sound } = await Audio.Sound.createAsync(
                        {
                            uri: cry,
                        },
                        { shouldPlay: true }
                    );
                    await sound.playAsync();
                } catch (error) {
                    console.error("Erreur lors de la lecture du fichier audio:", error);
                    alert("Le format du fichier audio n'est pas supporté sur iOS.");
                }
            }
        };

        const onPrevious = () => {
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.max(id - 1, 1)} })
        }

        const onNext = () => {
            router.replace({pathname: '/pokemon/[id]', params: {id: Math.min(id + 1, 151)} })
        }

        const isFirst = id === 1;
        const isLast = id === 151;

    return (
        <RootView backgroundColor={colorType}>
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
                <Card style={[styles.card, { overflow: "visible" }]}>
                    <Row style={styles.imageRow} gap={16}>
                        {
                            isFirst ? <View style={{ width: 24, height: 24 }}></View> : 
                                <Pressable onPress={onPrevious}>
                                <Image width={24} height={24} source={require('@/assets/images/prev.png')} />
                            </Pressable>
                        }
                    <Pressable onPress={onImagePress}>
                            <Image 
                                style={styles.artwork}
                                source={{
                                    uri: getPokemonArtwork(params.id)
                                }} 
                                width={200} 
                                height={200} 
                            />
                    </Pressable>
                    {
                        isLast ? <View style={{ width: 24, height: 24 }}></View> :

                        <Pressable onPress={onNext}>
                            <Image width={24} height={24} source={require('@/assets/images/next.png')} />
                        </Pressable>
                    }
                    </Row>
                    <Row gap={16} style={{height: 20}}>
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
                        {
                            stats.map(stat => (
                                <PokemonStat 
                                    key={stat.stat.name} 
                                    name={stat.stat.name} 
                                    value={stat.base_stat} 
                                    color={colorType} 
                                />
                            ))
                        }
                    </View>
                </Card>
           
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
    imageRow: {
        position: 'absolute',
        top: -140,
        zIndex: 2,
        justifyContent: 'space-between',
        left: 0,
        right: 0,
        paddingHorizontal: 20
    },
    artwork: {

    },
    card: {
        marginTop: 144,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        gap: 16,
    }
})
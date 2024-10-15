import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useFetchQuery, useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useThemeColors()

  // const pokemons = Array.from({length: 35}, (_, k) => ({
  //   name: 'Pokemon name',
  //   id: k + 1,

  // }))

  const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21')
  const pokemons = data?.pages.flatMap(page => page.results) ?? []

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.tint}]}
    >
      <View style={styles.header}>
          <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokedex</ThemedText>
      </View>
      <Card style={styles.body}>
        <FlatList 
          data={pokemons} 
          numColumns={3}
          columnWrapperStyle={[styles.gridGap, styles.list]}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={() => fetchNextPage()}
          contentContainerStyle={styles.gridGap}
          renderItem={({item}) => (
            <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{flex: 1/3}}>
             
            </PokemonCard>
          )} 
          keyExtractor={item => item.url}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
  },
  body: {
    flex: 1,
  },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 8,
  }
})

import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useFetchQuery, useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useThemeColors()

  // const pokemons = Array.from({length: 35}, (_, k) => ({
  //   name: 'Pokemon name',
  //   id: k + 1,

  // }))

  const {data, isFetching, fetchNextPage} = useInfiniteFetchQuery('/pokemon?limit=21')
  const [search, setSearch] = useState('');
  const pokemons = data?.pages.flatMap(page => page.results) ?? []
  const filteredPokemons = search ? pokemons.filter(pokemon => pokemon.name.includes(search.toLowerCase()) || getPokemonId(pokemon.url).toString() === search) : pokemons

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.tint}]}
    >
      <Row style={styles.header} gap={12}>
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemedText variant="headline" color="grayLight">Pokedex</ThemedText>
      </Row>
      <Row gap={12}>
        <SearchBar value={search} onChange={setSearch} />
      </Row>
      <Card style={styles.body}>
        <FlatList 
          data={filteredPokemons} 
          numColumns={3}
          columnWrapperStyle={[styles.gridGap, styles.list]}
          ListFooterComponent={
            isFetching ? <ActivityIndicator color={colors.tint} /> : null
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 8,
  }
})

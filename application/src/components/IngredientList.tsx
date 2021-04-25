import React from "react";
import { getIngredientListings, IngredientListing, Recipe } from "../data";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { StandardText } from "./StandardText";

type IngredientListProps = {
  recipe: Recipe;
};

/**
 * Lista av ingredienser från ett recept
 */

export function IngredientList({ recipe }: IngredientListProps) {
  const ingredients = getIngredientListings(recipe);

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={ingredients}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => <ListRow ingredient={item} />}
    />
  );
}

type ListRowProps = {
  ingredient: IngredientListing;
};

/**
 * Listans rader
 */
const ListRow = ({ ingredient }: ListRowProps) => (
  <View style={styles.row}>
    <View style={styles.rowInfoContainer}>
      <StandardText
        size={"SM"}
        textAlignment={"left"}
        text={ingredient.amount + " " + ingredient.unit + " " + ingredient.name}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
  },
  rowInfoContainer: {
    flex: 1,
    marginVertical: 6,
    flexDirection: "row",
  },
  name: {
    fontSize: 16,
  },
});

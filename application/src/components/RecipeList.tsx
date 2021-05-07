import React from "react";
import { recipes as importedRecipes, Recipe } from "../data";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { getRecipeThumbnail } from "../data";
import { StandardText } from "./StandardText";

type RecipeListProps = {
  viewFunction: (o: Recipe) => void;
};

/**
 * Receptlista, komponent som visar en FlatList med recept.
 * viewFunction körs vid tryckning på 'Visa' och används för redirection till receptet
 */

export function RecipeList({ viewFunction }: RecipeListProps) {
  const recipes = importedRecipes;

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListRow
          name={item.name}
          id={item.id}
          onViewPressed={() => viewFunction(item)}
        />
      )}
    />
  );
}

type ListRowProps = {
  name: string;
  id: string;
  onViewPressed: () => void;
};

/**
 * Listans rader
 */
const ListRow = ({ name, id, onViewPressed }: ListRowProps) => (
  <Pressable onPress={onViewPressed}>
    {({ pressed }) => (
      <View
        style={[
          styles.recipeCard,
          pressed ? styles.recipeCardColorPressed : styles.recipeCardColor,
        ]}
      >
        <View style={styles.recipeNameContainer}>
          <StandardText text={name} textAlignment={"left"} />
        </View>
        <View style={styles.recipeThumbnailContainer}>
          <Image
            source={getRecipeThumbnail(id)}
            style={styles.recipeThumbnail}
          />
        </View>
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    padding: 5,
    borderRadius: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // Android shadow
    elevation: 4,
  },
  recipeCardColor: {
    backgroundColor: "white",
  },
  recipeCardColorPressed: {
    backgroundColor: "lightgray",
  },
  recipeNameContainer: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
  },
  recipeNameText: {
    marginLeft: 5,
    fontSize: 20,
  },
  recipeThumbnail: {
    overflow: "hidden",
    height: 70,
    width: 70,
    borderRadius: 8,
  },
  recipeThumbnailContainer: {
    marginLeft: 5,
  },
});

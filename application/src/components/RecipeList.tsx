import React, { useEffect, useState } from "react";
import { recipes as importedRecipes, Recipe } from "../data";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";

type RecipeListProps = {
  viewFunction: (o: Recipe) => void;
};

export function RecipeList({ viewFunction, ...props }: RecipeListProps) {
  const [recipes, setRecipes] = useState(importedRecipes);

  useEffect(() => {
    setRecipes(importedRecipes);
  }, []);

  return (
    <FlatList
      {...props}
      data={recipes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListRow name={item.name} onViewPressed={() => viewFunction(item)} />
      )}
    />
  );
}

type ListRowProps = {
  name: string;
  onViewPressed: () => void;
};

const ListRow = ({ name, onViewPressed }: ListRowProps) => (
  <View style={styles.row}>
    <View style={styles.rowInfoContainer}>
      <Text style={styles.name}>{name}</Text>
    </View>
    <Button onPress={onViewPressed} title="Visa" />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    marginVertical: 3,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: "#FFFFF0",
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
  rowInfoContainer: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
  },
  name: {
    marginLeft: 5,
    fontSize: 20,
    lineHeight: 20,
  },
});

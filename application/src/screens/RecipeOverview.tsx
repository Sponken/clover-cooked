import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";
import { RouteProp } from "@react-navigation/native";

type RecipeOverviewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeOverview"
>;
type RecipeOverviewRouteProp = RouteProp<RootStackParamList, "RecipeOverview">;

type Props = {
  navigation: RecipeOverviewNavigationProp;
  route: RecipeOverviewRouteProp;
};

/**
 * Skärm för att visa relevant information om ett recept innan lagning
 */
export function RecipeOverview({ navigation, route }: Props) {
  const { recipe } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{recipe.name}</Text>
      <Text style={styles.description}>{recipe.description}</Text>
      <Text style={styles.description}>Portions: {recipe.portions}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: { fontSize: 12 },
});

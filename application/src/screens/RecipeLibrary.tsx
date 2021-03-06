import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { RecipeList } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";

type RecipeLibraryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeLibrary"
>;

type Props = {
  navigation: RecipeLibraryScreenNavigationProp;
};

/**
 * Receptbibliotek, skärm för att visa och navigera till recept
 */

export function RecipeLibrary({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <RecipeList
        viewFunction={(recipe) =>
          navigation.navigate("RecipeOverview", {
            recipe: recipe,
          })
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, RecipeLibrary, RecipeOverview, Cooking } from "../screens";
import { Recipe, User } from "../data";

export type RootStackParamList = {
  Home: undefined;
  RecipeLibrary: undefined;
  RecipeOverview: { recipe: Recipe };
  Cooking: { recipe: Recipe; users: User[] };
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Navigator, hanterar bläddrandet mellan skärmar
 */
export function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Clover Cooked" }}
        />
        <Stack.Screen
          name="RecipeLibrary"
          component={RecipeLibrary}
          options={{ title: "Recept Bibliotek" }}
        />
        <Stack.Screen
          name="RecipeOverview"
          component={RecipeOverview}
          options={{ title: "Recept" }}
        />
        <Stack.Screen name="Cooking" component={Cooking} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

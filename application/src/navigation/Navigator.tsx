import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, RecipeLibrary, RecipeOverview } from "../screens";
import { Recipe } from "../data";

export type RootStackParamList = {
  Home: undefined;
  RecipeLibrary: undefined;
  RecipeOverview: { recipe: Recipe };
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

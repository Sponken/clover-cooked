import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  Home,
  RecipeLibrary,
  RecipeOverview,
  SessionStart,
  ChefManagement,
} from "../screens";
import { Recipe } from "../data";

export type RootStackParamList = {
  Home: undefined;
  RecipeLibrary: undefined;
  RecipeOverview: { recipe: Recipe };
};

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Navigator, hanterar bläddrandet mellan skärmar
 * Kanske använda detta istället/också: https://reactnavigation.org/docs/drawer-navigator
 * https://reactnavigation.org/docs/drawer-navigator#nesting-drawer-navigators-inside-others
 * Kanske använda denna ist för createStackNavigator: https://reactnavigation.org/docs/native-stack-navigator
 */
export function Navigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Current Session">
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Drawer.Screen
          name="Current Session"
          component={Session}
          options={{ title: "Current Session" }}
        />
        <Drawer.Screen
          name="RecipeLibrary"
          component={RecipeLibraryNav}
          options={{ title: "Recipe Library" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const Session = () => (
  <Stack.Navigator initialRouteName="Session Start">
    <Stack.Screen
      name="Session Start"
      component={SessionStart}
      options={{ title: "Session Start" ,
        headerShown: false}}
    />
    <Stack.Screen
      name="Chef Management"
      component={ChefManagement}
      options={{ title: "Chef Management",
        headerShown: false}}
    />
  </Stack.Navigator>
);

const RecipeLibraryNav = () => (
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
);

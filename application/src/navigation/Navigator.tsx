import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Scheduler } from "../scheduler";

import {
  Home,
  RecipeLibrary,
  RecipeOverview,
  Cooking,
  ChefManagement,
  SessionStart,
  RecipeFinished,
} from "../screens";
import { Recipe, User } from "../data";

export type RootStackParamList = {
  Home: undefined;
  RecipeLibrary: undefined;
  RecipeOverview: { recipe: Recipe };
  Cooking: { recipe: Recipe; users: User[] /*initScheduler?: Scheduler */ };
  SessionStart: { recipe: Recipe; users: User[]; initScheduler?: Boolean };
  RecipeFinished: undefined;
  ChefManagement: { recipe?: Recipe; users: User[] };
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
      <Drawer.Navigator
        initialRouteName="RecipeLibrary"
        drawerStyle={{ backgroundColor: "#f5f5f5", width: 190 }}
      >
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ title: "Hem" }}
        />
        <Drawer.Screen
          name="Current Session"
          component={Session}
          options={{ title: "Matlagning", swipeEnabled: false }}
        />
        <Drawer.Screen
          name="RecipeLibrary"
          component={RecipeLibraryNav}
          options={{ title: "Receptbibliotek" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const Session = () => (
  <Stack.Navigator initialRouteName="SessionStart">
    <Stack.Screen
      name="SessionStart"
      component={SessionStart}
      options={{ title: "Session Start", headerShown: false }}
    />
    <Stack.Screen
      name="ChefManagement"
      component={ChefManagement}
      options={{ title: "ChefManagement", headerShown: false }}
    />
    <Stack.Screen
      name="Cooking"
      component={Cooking}
      options={{ headerShown: false, gestureEnabled: false }}
    />
    <Stack.Screen
      name="RecipeFinished"
      component={RecipeFinished}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const RecipeLibraryNav = () => (
  <Stack.Navigator initialRouteName="RecipeLibrary">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ title: "Clover Cooked" }}
    />
    <Stack.Screen
      name="RecipeLibrary"
      component={RecipeLibrary}
      options={{ title: "Recept Bibliotek", headerShown: false }}
    />
    <Stack.Screen
      name="RecipeOverview"
      component={RecipeOverview}
      options={{ headerShown: false, gestureEnabled: true }}
    />
  </Stack.Navigator>
);

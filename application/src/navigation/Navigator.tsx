import React, { useState } from "react";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { View, Switch, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
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
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="RecipeLibrary"
        drawerStyle={{ backgroundColor: "#f5f5f5", width: 200 }}
      >
        {/*<Drawer.Screen
          name="Home"
          component={Home}
          options={{ title: "Hem" }}
        />*/}
        <Drawer.Screen
          name="Current Session"
          component={Session}
          options={{ title: "Aktuell matlagning", swipeEnabled: false }}
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

function CustomDrawerContent(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled) {
      activateKeepAwake();
      alert("Activated");
    } else {
      deactivateKeepAwake();
      alert("Deactivated");
    }
  };
  return (
    <DrawerContentScrollView style={styles.extraDrawerItemsContainer}>
      <DrawerItemList {...props} />
      <View style={styles.switchContainer}>
        <Text>Keep Awake</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  extraDrawerItemsContainer: {},
});

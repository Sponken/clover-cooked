import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { ChefList } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";

//TODO: Vet inte om vi vill ha stack navigation här, eller om en vill kunna ändra i samma vy
type ChefManagementScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChefManagement"
>;

type Props = {
  navigation: ChefManagementScreenNavigationProp;
  route: any;
};

/**
 * Lista över kockar för hela tillagningen, skärm för att lägga till och redigera kockar
 */

export function ChefManagement({ navigation, route }: Props) {
  //console.log(route.params);
  return (
    <View style={styles.container}>
      <Button
        title="Log from ChefManagemnet"
        onPress={() => console.log(route.params.chefs)}
      />

      <ChefList chefs={route.params.chefs} setChefs={route.params.setChefs} />

      {/* Måste uppdatera state även här */}
      <Button
        onPress={() => {
          route.params.setChefs([
            ...route.params.chefs,
            {
              id: Math.random().toString(),
              name: "Frodo",
              color: "Blue",
              image: "todo",
            },
          ]);
        }}
        title="Add Chef New"
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chefImageInList: {
    height: 30,
    width: 30,
  },
});

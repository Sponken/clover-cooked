import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import React, { useState } from "react";

import { chefs as importedChefs, Chef } from "../data";

import { ChefsOverview } from "../components";

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
 * Skärm för att starta matlagningen, du har valt recept innan denna
 */

export function SessionStart({ navigation, route }: Props) {
  // let users;
  // if (route.params?.post === undefined) {users = [{userName: "Bob", id: 1}, {userName: "Rob", id: 2}, {userName: "Nob", id: 3}]}
  // else users = route.params?.post;

  const [chefs, setChefs] = useState(importedChefs);

  // function updatingChefs(a) {
  //   setChefs(a);
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.container}>
        TODO: Hamburgerknapp ska finnas här med
      </Text>
      <Text style={styles.container}>TODO: Visa bild på recept här</Text>
      <View style={styles.container}>
        <ChefsOverview />
        <Button
          title="Edit Chefs"
          onPress={() =>
            navigation.navigate("Chef Management", {
              chefs: chefs,
              setChefs: setChefs,
            })
          }
        />
        {/* TODO: ev ta med setChefs?

        Skickar med en funktion
        */}
        {/* <RecipeList
        viewFunction={(recipe) =>
          navigation.navigate("RecipeOverview", {
            recipe: recipe,
          })
        }
      /> */}
      </View>

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

export default SessionStart;

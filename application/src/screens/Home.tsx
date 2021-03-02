import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";
import { recipes } from "../data";

const example_recipe = recipes[0];
const example_users = [
  {
    id: "kalle",
    name: "Kalle Anka",
    color: "white",
    icon: require("../../assets/image/icon.png"),
  },
];

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

/**
 * Hem skärm, första skärmen som visas vid vanlig öppning av appen
 */
export function Home({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <Button
        title="Recept Bibliotek"
        onPress={() => navigation.navigate("RecipeLibrary")}
      />
      <Button
        title="Matlagningsskärm"
        onPress={() =>
          navigation.navigate("Cooking", {
            recipe: example_recipe,
            users: example_users,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

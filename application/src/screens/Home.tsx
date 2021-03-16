import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";
import { recipes } from "../data";

// Exempelkod för att matlagnings skärmen skall fungera
const recipe = recipes[0];
const users = [
  {
    id: "kalle",
    name: "Kalle Anka",
    color: "red",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "musse",
    name: "Musse Pigg",
    color: "blue",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "anna",
    name: "Anna Anka",
    color: "green",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "ovowewewe",
    name:
      "Ovowewewe Onienteiniewe Ogwemobwem Ossas Ovowewewe Onienteiniewe Ogwemobwem Ossas",
    color: "purple",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "olof",
    name: "Olof",
    color: "teal",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "janne",
    name: "Jan Eliasson",
    color: "black",
    icon: require("../../assets/image/icon.png"),
  },
  {
    id: "axel",
    name: "Kam Axel",
    color: "#ffcd42",
    icon: require("../../assets/image/icon.png"),
  },
];

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

/**
 * Hemskärm, första skärmen som visas vid vanlig öppning av appen
 * TODO: Ifall recept igång, visa det som första skärm,
 *  annars Receptbibliotek som första skärmen, menu om en klickar på Hamburger top left
 */
export function Home({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Fortsätt sessionen</Text>
      <Button
        title="Receptbibliotek"
        onPress={() => navigation.navigate("RecipeLibrary")}
      />
      <Button
        title="Matlagningsskärm"
        onPress={() =>
          navigation.navigate("Current Session", {
            screen: "Cooking",
            params: {
              recipe,
              users,
            },
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

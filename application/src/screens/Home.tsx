import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";

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

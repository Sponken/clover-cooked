import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
import schedule from "../scheduler/schedule";

type Props = {
  navigation: HomeScreenNavigationProp;
};

/**
 * Hem skärm, första skärmen som visas vid vanlig öppning av appen
 */
export function Home({ navigation }: Props) {
  schedule();
  console.log("Schedule avklarad!");

  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <Button
        title="Recept Bibliotek"
        onPress={() => navigation.navigate("RecipeLibrary")}
      />
      <Button
        title="DEV Schedule"
        onPress={() => {
          schedule();
          console.log("Schemaläggning avklarad");
        }}
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

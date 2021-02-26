import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";

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
        title="Go to recipe library"
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

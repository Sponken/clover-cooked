import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableHighlight,
} from "react-native";

import { StandardButton, StandardText } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";

import { SafeAreaView } from "react-native-safe-area-context";

type RecipeFinishedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeFinished"
>;

type Props = {
  navigation: RecipeFinishedScreenNavigationProp;
};

export function RecipeFinished({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.textContainer}>
        <StandardText size="large" color="secondary" text="Smaklig måltid!" />
      </View>
      <StandardButton
        onPress={() => {
          navigation.setParams({ recipe: undefined });
          navigation.navigate("RecipeLibrary", {
            screen: "RecipeLibrary",
          });
        }}
        buttonText="Klar"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    padding: 10,
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
  },
});

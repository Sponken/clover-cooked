import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";

type CookingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cooking"
>;

type Props = {
  navigation: CookingScreenNavigationProp;
};

/**
 * Cooking, skärmen som visas under tiden matlagningen sker
 */
export function Cooking({ navigation }: Props) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBarContainer}></View>
      <View style={styles.contentContainer}>
        <Text>Hello</Text>
      </View>
      <View style={styles.buttonContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  topBarContainer: {
    backgroundColor: "blue",
    height: 100,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "green",
  },
  buttonContainer: {
    backgroundColor: "yellow",
    height: 100,
  },
});

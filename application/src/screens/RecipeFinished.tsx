import React from "react";
import { Text } from "react-native";

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
    <SafeAreaView>
      <Text>Smaklig måltid!</Text>
    </SafeAreaView>
  );
}

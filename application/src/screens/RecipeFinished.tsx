import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableHighlight,
} from "react-native";

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
        <Text style={styles.textStyle}>Smaklig måltid!</Text>
      </View>
      <View style={styles.pressableContainer}>
        <TouchableHighlight
          onPress={() => {
            navigation.setParams({ recipe: undefined });
            navigation.navigate("RecipeLibrary", {
              screen: "RecipeLibrary",
            });
          }}
          style={styles.touchableHighLight}
        >
          <View style={styles.pressable}>
            <Text style={styles.pressableText}>
              Okej, ta mig tillbaka till receptbibliotek
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
  },
  textStyle: {
    color: "hotpink",
    fontSize: 40,
  },
  touchableHighLight: {
    borderRadius: 5,
  },
  pressableContainer: {
    margin: 10,
  },
  pressable: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "hotpink",
    borderRadius: 4,
  },
  pressableText: {
    color: "white",
    fontSize: 22,
  },
});

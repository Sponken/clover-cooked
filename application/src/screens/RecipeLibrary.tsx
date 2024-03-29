import { StyleSheet, View, Pressable, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/routers";
import { StackNavigationProp } from "@react-navigation/stack";

import { RecipeList, StandardText } from "../components";
import { RootStackParamList } from "../navigation";

type RecipeLibraryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeLibrary"
>;

type Props = {
  navigation: RecipeLibraryScreenNavigationProp;
};

/**
 * Receptbibliotek, skärm för att visa och navigera till recept
 */

export function RecipeLibrary({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.entireScreenContainer}>
      <View style={styles.topContainer}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <View>
            <Image
              style={styles.hamburgerContainer}
              source={require("../../assets/image/hamburger.png")}
            />
          </View>
        </Pressable>
        <View style={styles.titleContainer}>
          <StandardText text={"Receptbibliotek"} textWeight={"bold"} />
        </View>
        {/*Vien under är fulhack för att centrera texten på hela skärmen*/}
        <View style={styles.topContainer}></View>
      </View>
      <View style={styles.recepiesContainer}>
        <RecipeList
          viewFunction={(recipe) =>
            navigation.navigate("RecipeOverview", {
              recipe: recipe,
            })
          }
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  entireScreenContainer: {
    flex: 1,
  },
  topContainer: {
    height: 30,
    flexDirection: "row",
    margin: 10,
  },
  hamburgerContainer: {
    height: 30,
    width: 30,
    marginLeft: 6,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  recepiesContainer: {
    flex: 1,
    padding: 5,
  },
});

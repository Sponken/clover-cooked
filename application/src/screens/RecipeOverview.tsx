import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation";
import { RouteProp } from "@react-navigation/native";

type RecipeOverviewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeOverview"
>;
type RecipeOverviewRouteProp = RouteProp<RootStackParamList, "RecipeOverview">;

type Props = {
  navigation: RecipeOverviewNavigationProp;
  route: RecipeOverviewRouteProp;
};

/**
 * Skärm för att visa relevant information om ett recept innan lagning
 */
export function RecipeOverview({ navigation, route }: Props) {
  const { recipe } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topImageContainer}>
          <ImageBackground
            source={getRecipeThumbnail(recipe.id)}
            style={styles.topImage}
          >
            <Pressable onPress={() => navigation.navigate("RecipeLibrary")}>
              <View style={styles.backIconContainer}>
                <Image source={require("../../assets/image/backImg.png")} />
              </View>
            </Pressable>
            <View style={styles.timeContainer}>
              <Image
                style={styles.timeIcon}
                source={require("../../assets/image/time_icon.png")}
              />
              <Text style={styles.timeText}>1h</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{recipe.name}</Text>
          </View>
          <View style={styles.portionsContainer}>
            <Text style={styles.portions}>Portioner: {recipe.portions}</Text>
          </View>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            style={styles.tabBar}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate("Current Session", {
              screen: "SessionStart",
              params: {
                recipe,
              },
            })
          }
        >
          {({ pressed }) => (
            <View
              style={[
                styles.button,
                pressed ? styles.buttonColorPressed : styles.buttonColor,
              ]}
            >
              <Text style={styles.buttonText}>Starta matlagning</Text>
            </View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
  },
  topImageContainer: {
    flex: 1,
  },
  topImage: {
    flex: 1,
    justifyContent: "space-between",
  },
  backIconContainer: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    margin: 6,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    margin: 6,
    padding: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: { fontSize: 12 },
});

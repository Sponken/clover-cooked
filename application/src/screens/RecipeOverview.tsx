import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../navigation";
import {
  IngredientList,
  StandardButton,
  primaryColor,
  StandardText,
} from "../components";
import { getRecipeThumbnail } from "../data";

// @ts-ignore
// import { Parallax, Background } from "react-parallax";

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
 * Skärm för att visa relevant information om ett specifikt recept innan lagning
 */
export function RecipeOverview({ navigation, route }: Props) {
  const { recipe } = route.params;
  const layout = useWindowDimensions(); // Används för att få skärm bredd
  const [index, setIndex] = React.useState(0); // State för vilken sida i tabviewn som visas
  const [routes] = React.useState([
    // State för vilka sidor som finns i tabview
    { key: "ing", title: "Ingredienser" },
    { key: "des", title: "Beskrivning" },
  ]);

  // komponenter till tab view
  const Ingredients = () => (
    <View style={{ flex: 1 }}>
      <IngredientList recipe={recipe} />
    </View>
  );

  const Description = () => (
    <View style={styles.tabViewSceneContainer}>
      <StandardText
        size={"SM"}
        textAlignment={"left"}
        text={recipe.description}
      />
    </View>
  );

  const renderScene = SceneMap({
    ing: Ingredients,
    des: Description,
  });

  // Navigationsbar för tabviewn
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: primaryColor }}
      style={{ backgroundColor: "white" }}
      getLabelText={({ route }) => route.title}
      renderLabel={({ route, focused, color }) => (
        <StandardText
          size={"SM"}
          text={route.title}
          color={focused ? "black" : "passive"}
        />
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View style={styles.contentContainer}>
        <View style={styles.topImageContainer}>
          <ImageBackground
            source={getRecipeThumbnail(recipe.id)}
            style={styles.topImage}
          >
            <SafeAreaView style={styles.topImage} edges={["top"]}>
              <View style={styles.backIconContainer}>
                <StandardButton
                  onPress={() => navigation.navigate("RecipeLibrary")}
                  buttonIcon={
                    <Image
                      style={styles.backIcon}
                      source={require("../../assets/image/backImg.png")}
                    />
                  }
                  buttonType={"white"}
                  buttonSize={"square"}
                />
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <StandardText
              text={recipe.name}
              textAlignment={"left"}
              textWeight={"bold"}
            />
          </View>
          <View style={styles.portionsContainer}>
            <StandardText
              size={"SM"}
              text={
                recipe.portions +
                " " +
                (recipe.portions === 1 ? "portion" : "portioner")
              }
            />
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
        <StandardButton
          buttonText="Välj recept"
          onPress={() =>
            navigation.navigate("Current Session", {
              screen: "SessionStart",
              params: {
                recipe,
              },
            })
          }
        />
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
    marginVertical: 4,
    marginLeft: 14,
  },
  backIcon: {
    height: 18,
    width: 10,
    marginRight: 3,
  },
  timeContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    margin: 6,
    padding: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 2,
  },

  nameContainer: {
    padding: 8,
    margin: 5,
  },
  portionsContainer: {
    marginHorizontal: 8,
    padding: 6,
    alignSelf: "flex-start",
  },
  tabBar: {
    flex: 1,
    marginTop: 2,
  },
  tabViewSceneContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
});

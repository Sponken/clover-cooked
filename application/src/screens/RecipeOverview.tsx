import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../navigation";
import { IngredientList } from "../components";
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
      <Text style={styles.descriptionText}>{recipe.description}</Text>
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
      indicatorStyle={{ backgroundColor: "green" }}
      style={{ backgroundColor: "white" }}
      getLabelText={({ route }) => route.title}
      labelStyle={{ color: "green" }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={focused ? styles.tabViewLabelFocused : styles.tabViewLabel}
        >
          {route.title}
        </Text>
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
              <Pressable onPress={() => navigation.navigate("RecipeLibrary")}>
                <View style={styles.backIconContainer}>
                  <Image source={require("../../assets/image/backImg.png")} />
                </View>
              </Pressable>
            </SafeAreaView>
          </ImageBackground>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{recipe.name}</Text>
          </View>
          <View style={styles.portionsContainer}>
            <Text style={styles.portions}>
              {recipe.portions +
                " " +
                (recipe.portions === 1 ? "portion" : "portioner")}
            </Text>
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
  },
  infoContainer: {
    flex: 2,
  },

  nameContainer: {
    backgroundColor: "white",
    padding: 8,
    margin: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  portionsContainer: {
    marginHorizontal: 8,
    padding: 6,
    alignSelf: "flex-start",
  },
  portions: { fontSize: 15 },
  tabBar: {
    flex: 1,
    marginTop: 2,
  },
  tabViewLabel: {
    color: "gray",
  },
  tabViewLabelFocused: {
    color: "black",
  },
  tabViewSceneContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  descriptionText: {
    fontSize: 16,
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
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    borderRadius: 8,
    height: 50,
    marginHorizontal: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // Android shadow
    elevation: 4,
  },
  buttonColor: {
    backgroundColor: "#38a13f",
  },
  buttonColorPressed: {
    backgroundColor: "#1d8c25",
  },
});

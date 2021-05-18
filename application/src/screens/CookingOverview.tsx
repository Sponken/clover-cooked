import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  useWindowDimensions,
  Text,
  FlatList,
} from "react-native";
import React, { useState, useContext } from "react";
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
import { getRecipeThumbnail, User } from "../data";

import { schedulerContext } from "./scheduler-context";
import * as Progress from "react-native-progress";
import { OverviewCard } from "../components/OverviewCard";

type CookingOverviewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CookingOverview"
>;

type CookingOverviewRouteProp = RouteProp<
  RootStackParamList,
  "CookingOverview"
>;

type Props = {
  navigation: CookingOverviewNavigationProp;
  route: CookingOverviewRouteProp;
};

export function CookingOverview({ navigation, route }: Props) {
  const { users } = route.params;
  const { scheduler } = useContext(schedulerContext);
  if (scheduler) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.backIconContainer}>
            <StandardButton
              onPress={() => navigation.navigate("Cooking")}
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
          <View style={styles.titleTextContainer}>
            <StandardText text="Matlagningsöverblick" />
          </View>
        </View>
        <View style={{ flexDirection: "row", flexShrink: 0.5 }}>
          <OverviewCard
            text="dummy text"
            users={users}
            displayUsers={[users[0].id, users[1].id]}
            type="branch"
            onPress={() => null}
            progress={0}
          />
          <OverviewCard
            text="dummy text"
            users={users}
            displayUsers={[users[0].id, users[1].id]}
            type="branch"
            onPress={() => null}
            progress={0}
          />
          <OverviewCard
            text="dummy text sajdaoisdjaosidjas"
            users={users}
            displayUsers={[users[0].id, users[1].id]}
            type="branch"
            onPress={() => null}
            progress={0}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backIconContainer: {
    alignSelf: "flex-start",
    marginLeft: 14,
    position: "absolute",
    left: 0,
  },
  backIcon: {
    height: 18,
    width: 10,
    marginRight: 3,
  },
  titleContainer: {
    flexDirection: "row",
    marginVertical: 6,
    justifyContent: "center",
  },
  titleTextContainer: {},
});

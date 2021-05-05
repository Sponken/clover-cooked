import React from "react";
import { StyleSheet, View, FlatList, Image, Pressable } from "react-native";
import { User } from "../data";
import { StandardText } from "./StandardText";
import { StandardButton } from "./StandardButton";

const CHEF_ICON_SIZE = 38;

type ChefListProps = {
  users: User[];
  nav: any;
  recipeActivated: boolean;
};

/**
 * Lista av kockar aktiva i matlagningen, ev klicka på kock för att se dess vy
 *
 */

export function ChefsOverview({ users, nav, recipeActivated }: ChefListProps) {
  //TODO, store chefs somewhere? History? Like Smash Bros

  return (
    <FlatList
      data={[...users, { id: "editChef" }]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        if (item.id === "editChef" && !recipeActivated) {
          return (
            <View style={styles.flatListItemContainer}>
              <StandardButton
                buttonText={"Redigera kockar"}
                buttonType={"secondary"}
                onPress={() =>
                  nav.navigate("ChefManagement", {
                    users,
                  })
                }
                buttonIcon={
                  <Image
                    style={styles.editChefsIcon}
                    source={require("../../assets/image/editChefGreen.png")}
                  />
                }
              />
            </View>
          );
        }
        if (item.id === "editChef") {
          return <></>;
        }
        return <ChefItem chef={item} />; //remove chef/edit chef instead?
      }}
    />
  );
}

type ListRowProps = {
  chef: any;
};

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ChefItem = ({ chef }: ListRowProps) => {
  let userCircleView = <></>;
  if (chef) {
    userCircleView = (
      <View style={styles.chefItemContainer}>
        <StandardButton
          buttonSize={"circleBig"}
          buttonType={"customColor"}
          buttonColor={chef.color}
          buttonIcon={
            chef.color ? (
              <Image
                style={{ height: CHEF_ICON_SIZE, width: CHEF_ICON_SIZE }}
                source={require("../../assets/image/chefHat.png")}
              />
            ) : (
              <></>
            )
          }
          onPress={() => {}}
        />
        <View style={{ width: 10 }}></View>
        <StandardText text={chef.name} />
      </View>
    );
  }

  return (
    <View style={styles.flatListItemContainer}>
      <View style={styles.chefItemContainer}>
        {userCircleView}
        {/* <Text>[Chef's next task]</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatListItemContainer: {
    paddingVertical: 7,
    marginHorizontal: 10,
  },
  chefItemContainer: {
    flexDirection: "row",
  },
  editChefsIcon: {
    height: 50,
    width: 50,
  },
});

export default ChefsOverview;

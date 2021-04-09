import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { User } from "../data";
import { StandardText } from "./StandardText";

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
    <View>
      <FlatList
        data={[...users, { id: "editChef" }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.id === "editChef" && !recipeActivated) {
            return (
              <View style={styles.flatListItemContainer}>
                <TouchableOpacity
                  style={styles.editChefButton}
                  onPress={() =>
                    nav.navigate("ChefManagement", {
                      users,
                    })
                  }
                >
                  <Image
                    style={styles.editChefsIcon}
                    source={require("../../assets/image/editChef.png")}
                  />
                  <View style={styles.editChefsTextContainer}>
                    <StandardText text={"Redigera kockar"} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
          return <ChefItem chef={item} />; //remove chef/edit chef instead?
        }}
      />
    </View>
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
  let userImage = (
    <Image
      style={{ width: 80, height: 80 }}
      source={require("../../assets/image/favicon.png")}
    />
  );

  let defaultImage = (
    <TouchableOpacity
      style={[styles.chefIcon, { backgroundColor: chef.color }]}
    >
      <StandardText text={chef.name} color="white" size={"SM"} />
    </TouchableOpacity>
  );

  let userCircleView = defaultImage;
  /*if (chef.icon != undefined) {
    userCircleView = userImage;
  } else {
    userCircleView = defaultImage;
  }*/

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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  chefItemContainer: {
    flexDirection: "row",
    flex: 1,
  },
  chefIcon: {
    height: 80,
    width: 80,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: chef.color, //userColor,
  },
  editChefButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    height: 70,
    marginLeft: 5,
    backgroundColor: "#d6d6d6", //"#a4a4a4",
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
  editChefsIcon: {
    height: 65,
    width: 65,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  editChefsTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 40,
  },
});

export default ChefsOverview;

import React, { useEffect, useState } from "react";
import { chefs as importedChefs, Chef } from "../data";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

type ChefListProps = {
  chefList: any;
  nav: any;
};

/**
 * Lista av kockar aktiva i matlagningen, ev klicka på kock för att se dess vy
 *
 */

export function ChefsOverview({ chefList, nav }: ChefListProps) {
  //TODO, store chefs somewhere? History? Like Smash Bros

  return (
    <View style={{ height: 500 }}>
      <FlatList
        data={[...chefList, { edit: true, id: "editChef" }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.edit) {
            return (
              <TouchableOpacity
                style={styles.editChefsButton}
                onPress={() =>
                  nav.navigate("ChefManagement", {
                    users: { chefList },
                  })
                }
              >
                <View style={styles.rowInfoContainer}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-start",
                      flexDirection: "row",
                      // backgroundColor: "red",
                    }}
                  >
                    <Image
                      style={{
                        margin: 0,
                        marginLeft: 13,
                        height: 75,
                        width: 75,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 100 * 2,
                      }}
                      source={require("../../assets/image/editChef.png")} //TODO: chef.image
                      // check chef.color to decide color of border
                    />
                  </View>
                  <View
                    style={{
                      flex: 2.5,
                      alignItems: "center",
                      flexDirection: "row",
                      height: 75,
                      // backgroundColor: "red",
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        flex: 1,
                        fontSize: 18,
                      }}
                    >
                      Edit Chefs
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
          return <ListRow chef={item} />; //remove chef/edit chef instead?
        }}
      />
    </View>
  );
}

type ListRowProps = {
  chef: Chef;
  chefs: any;
  setChefs: any;
};

//signaler för att uppdatera saker
// lägga in funktioner i en signal, ber den uppdatera om det behövs

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ListRow = ({ chef }: ListRowProps) => {
  // const delChef = () => {
  //   setChefs(chefs.filter((x) => x.id !== chef.id));
  // };

  let userImage = (
    <Image
      style={styles.chefImageInList}
      source={require("../../assets/image/favicon.png")} //TODO: chef.image
      // check chef.color to decide color of border
    />
  );

  // let userColor;
  // if ((chef.color = "Blue")) {
  //   userColor = "#7986cb";
  // } else {
  //   userColor = "#1281cb";
  // }

  let defaultImage = (
    <TouchableOpacity
      style={{
        margin: 0,
        height: 100,
        width: 100,
        backgroundColor: chef.color, //userColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100 * 2,
      }}
      // onPress={props.onPress}
    >
      <Text style={{ color: "white", fontSize: 20 }}>{chef.name}</Text>
    </TouchableOpacity>
  );

  let userCircleView;
  if (chef.icon != undefined) {
    userCircleView = userImage;
  } else {
    userCircleView = defaultImage;
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowInfoContainer}>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          {userCircleView}
          {/* {<Text style={styles.name}>{chef.name}</Text>} */}
        </View>
        {/* Färg på namn beroende på deras färg? Hur syns den ifall personen har bild annars?*/}
        {/* <Text style={styles.name}>{chef.name}</Text> */}
      </View>
      {/* <Text style={{ alignItems: "center", fontSize: 24 }}>{chef.name}</Text> */}

      {/* <Text style={styles.quickView}>[Chef's next task]</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    // backgroundColor: "#FFFFFF",
    borderRadius: 10,

    // // iOS shadow
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // // Android shadow
    // elevation: 4,
  },
  rowInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 10,
    marginTop: 2,
  },
  chefImageInList: {
    marginLeft: 20,
    width: 80,
    height: 80,
    flex: 1,
  },
  editChefsButton: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    // backgroundColor: "red",
    borderRadius: 10,
  },
  quickView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5,
    fontSize: 18,
  },
});

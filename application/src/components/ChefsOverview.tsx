import React, { useEffect, useState, TouchableOpacity } from "react";
import { chefs as importedChefs, Chef } from "../data";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  TextInput,
} from "react-native";

type ChefListProps = {
  chefList: any;
};

/**
 * Lista av kockar aktiva i matlagningen, ev klicka på kock för att se dess vy
 *
 */

export function ChefsOverview({ chefList }: ChefListProps) {
   //TODO, store chefs somewhere? History? Like Smash Bros

  // useEffect(() => {
  //   setChefs(importedChefs);
  // }, []);

  return (
    <View>
      <FlatList
        data={chefList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow chef={item} /> //remove chef/edit chef instead?
        )}
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
const ListRow = ({ chef}: ListRowProps) => {
  // const delChef = () => {
  //   setChefs(chefs.filter((x) => x.id !== chef.id));
  // };

  return (
    <View style={styles.row}>
      <View style={styles.rowInfoContainer}>
        <Image
          style={styles.chefImageInList}
          source={require("../../assets/image/favicon.png")} //TODO: chef.image
        />
        {/* Färg på namn beroende på deras färg? Hur syns den ifall personen har bild annars?*/}
        {/* <Text style={styles.name}>{chef.name}</Text> */}
      </View>
      <Text style={styles.rowInfoContainer}>{chef.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    marginVertical: 3,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,

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
  rowInfoContainer: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
  },
  chefImageInList: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
  name: {
    marginLeft: 5,
    fontSize: 20,
    lineHeight: 20,
  },
});

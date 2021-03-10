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
import { Console } from "console";

type ChefListProps = {
  chefList: any;
  setChefList: any;
};

/**
 * Lista av kockar aktiva i matlagningen, komponent som visar en FlatList med kockar.
 *
 */

export function ChefList({ chefList, setChefList }: ChefListProps) {
  useEffect(() => {
    // setChefs(setChefs(edit(chefs.findIndex((el) => el.id === chef.id), chef));
  }, []);

  return (
    <View>
      <FlatList
        // {...props}
        data={chefList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow chef={item} chefList={chefList} setChefList={setChefList} /> //remove chef/edit chef instead?
        )}
      />
    </View>
  );
}

type ListRowProps = {
  chef: Chef;
  chefList: any;
  setChefList: any;
};

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ListRow = ({ chef, chefList, setChefList }: ListRowProps) => {
  //console.log("Logging Listrow in chefList")
  //console.log(chefList)

  //Här spagettas det hårt, funktionen gör en kopia på chefList och splicear in den chef vi vill ändra.
  //Funktionen kommer göra det efter varje gång man ändrar texten, vet inte om det innebär varje gång man
  //skriver en ny bokstav eller när man editat klart.
  function edit(index, chef, name) {
    let b = Array.from(chefList);

    let tempChef: Chef = {
      id: chef.id,
      name: name,
      color: chef.color,
      image: chef.image,
    };

    b.splice(index, 1, tempChef);
    //console.log(b)
    return b;
  }

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

      <View style={{ flex: 4, flexDirection: "row", alignItems: "flex-start" }}>
        <TextInput
          style={{
            height: 40,
            backgroundColor: "white",
            alignItems: "flex-start",
            flex: 1,
          }}
          defaultValue={chef.name}
          onChangeText={(name) => {
            setChefList(
              edit(chefList.findIndex((c) => c.id === chef.id), chef, name)
            );
          }}
        />
      </View>

      <Button
        onPress={() => setChefList(chefList.filter((x) => x.id !== chef.id))}
        title="x" // Delete?
      />
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

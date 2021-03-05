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
  chefs: any;
  setChefs: any;
};

/**
 * Lista av kockar aktiva i matlagningen, komponent som visar en FlatList med kockar.
 *
 */

export function ChefList({ chefs, setChefs, ...props }: ChefListProps) {
  useEffect(() => {
    // setChefs(setChefs(edit(chefs.findIndex((el) => el.id === chef.id), chef));
  }, []);

  return (
    <View>
      <FlatList
        // {...props}
        data={chefs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow chef={item} chefs={chefs} setChefs={setChefs} /> //remove chef/edit chef instead?
        )}
      />

      <Button title="Log" onPress={() => console.log(chefs)} />

      {/* Button with image inside: https://aboutreact.com/image-icon-inside-the-react-native-button/#Image-Icon-in-Button */}
      {/* Not sure how to fix "onPress" here though! */}
      {/* <TouchableOpacity activeOpacity={0.5}>
        <Image
          style={styles.chefImageInList}
          source={require("../../assets/image/favicon.png")} //TODO: chef.image
        />
        <Text> Lägg till Kock </Text>
      </TouchableOpacity> */}
    </View>
  );
}

type ListRowProps = {
  chef: Chef;
  chefs: any;
  setChefs: any;
};

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ListRow = ({ chef, chefs, setChefs }: ListRowProps) => {
  const [temporaryChefName, settemporaryChefName] = useState(chef.name);

  //let temporaryChefName = chef.name;
  function edit(index, chef) {
    let b = chefs;
    chef.name = temporaryChefName;
    b.splice(index, 1, chef);
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
      <TextInput
        style={{
          height: 40,
          backgroundColor: "white",
          alignItems: "flex-start",
          flex: 1,
        }}
        defaultValue={temporaryChefName}
        onChangeText={(temporaryChefName) => {
          settemporaryChefName(temporaryChefName);
        }}

        // /*(value) => setValue(value)*/
        // () => {
        //   setChefs(edit(chefs.findIndex((el) => el.id === chef.id), chef));
        // }
      />

      <Button
        onPress={() => setChefs(chefs.filter((x) => x.id !== chef.id))}
        title="Delete"
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

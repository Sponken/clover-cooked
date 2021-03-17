import React, { useEffect } from "react";
//import { chefs as importedChefs, Chef } from "../data";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  TextInput,
  Pressable,
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
  return (
    <View style={{ height: 800 }}>
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
  chef: any;
  chefList: any;
  setChefList: any;
};

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ListRow = ({ chef, chefList, setChefList }: ListRowProps) => {
  //Här spagettas det hårt, funktionen gör en kopia på chefList och splicear in den chef vi vill ändra.
  //Funktionen kommer göra det efter varje gång man ändrar texten, vet inte om det innebär varje gång man
  //skriver en ny bokstav eller när man editat klart.
  function edit(index, chef, name) {
    let b = Array.from(chefList);

    let tempChef = {
      id: chef.id,
      name: name,
      color: chef.color,
      icon: chef.icon,
    };

    b.splice(index, 1, tempChef);
    return b;
  }

  function editColor(index, chef) {
    let b = Array.from(chefList);

    let color = [
      "#5884E0",
      "#9400D3",
      "#4B0082",
      "#0000FF",
      "#00FF00",
      "#FFF000",
      "#FF7F00",
      "#FF0000",
    ];

    function checkColor(col) {
      return col == chef.color.toString();
    }
    let colIndex = color.findIndex(checkColor);
    //let colIndex = color.findIndex((c) => c == chef.color.toString());

    if (colIndex < color.length - 1) {
      colIndex += 1;
    } else {
      colIndex = 0;
    }

    let tempChef = {
      id: chef.id,
      name: chef.name,
      color: color[colIndex],
      icon: chef.icon,
    };

    b.splice(index, 1, tempChef);
    return b;
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowInfoContainer}>
        <Pressable
          style={{
            margin: 0,
            height: 30,
            width: 30,
            backgroundColor: chef.color, //userColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100 * 2,
          }}
          onPress={() => {
            setChefList(
              editColor(chefList.findIndex((c) => c.id === chef.id), chef)
            );
          }}
        />
      </View>
      <View style={{ flex: 4, flexDirection: "row", alignItems: "flex-start" }}>
        <TextInput
          style={{
            height: 40,
            backgroundColor: "white",
            alignItems: "flex-start",
            flex: 1,
            fontSize: 24,
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

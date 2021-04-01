import React, { useEffect } from "react";
//import { chefs as importedChefs, Chef } from "../data";
import {
  StyleSheet,
  View,
  FlatList,
  Button,
  TextInput,
  Pressable,
  ColorValue,
} from "react-native";

import { User } from "../data";

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
  function edit(index: number, chef: User, name: string) {
    let newChefs: User[] = Array.from(chefList);

    let tempChef: User = {
      id: chef.id,
      name: name,
      color: chef.color,
      icon: chef.icon,
    };

    newChefs.splice(index, 1, tempChef);
    return newChefs;
  }

  function editColor(index: number, chef: User) {
    let newChefs = Array.from(chefList);

    let color = [
      "#B856E9",
      "#E956CD",
      "#E3993B",
      "#EAD755",
      "#95DD69",
      "#22BC29",
      "#4DE1E1",
      "#4DA4E1",
      "#4F5EED",
      //"#FF0000", //Ej kompatibel med färgen på notis för användare
    ];

    function checkColor(col: ColorValue) {
      return col == chef.color.toString();
    }

    let colIndex = color.findIndex(checkColor);
    //let colIndex = color.findIndex((c) => c == chef.color.toString());

    if (colIndex < color.length - 1) {
      colIndex += 1;
    } else {
      colIndex = 0;
    }

    let tempChef: User = {
      id: chef.id,
      name: chef.name,
      color: color[colIndex],
      icon: chef.icon,
    };

    newChefs.splice(index, 1, tempChef);
    return newChefs;
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowInfoContainer}>
        <Pressable
          style={[styles.chefColor, { backgroundColor: chef.color }]} //userColor,}
          onPress={() => {
            setChefList(
              editColor(chefList.findIndex((c: User) => c.id === chef.id), chef)
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
              edit(
                chefList.findIndex((c: User) => c.id === chef.id),
                chef,
                name
              )
            );
          }}
        />
      </View>

      <Button
        onPress={() =>
          setChefList(chefList.filter((c: User) => c.id !== chef.id))
        }
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
  chefColor: {
    margin: 0,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100 * 2,
  },
  name: {
    marginLeft: 5,
    fontSize: 20,
    lineHeight: 20,
  },
});

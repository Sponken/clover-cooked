import React, { useState } from "react";
//import { chefs as importedChefs, Chef } from "../data";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Pressable,
  ColorValue,
  Image,
  Text,
} from "react-native";

import { User } from "../data";
import { StandardText } from "./StandardText";
import {chefColors} from "./Colors";

type ChefListProps = {
  chefList: any;
  setChefList: any;
};

/**
 * Lista av kockar aktiva i matlagningen, komponent som visar en FlatList med kockar.
 *
 */

export function ChefList({ chefList, setChefList }: ChefListProps) {
  // Hitta det senaste färgindexet för att kunna fördela nya
  let lastColorIndex = chefColors.indexOf(chefList[chefList.length - 1]?.color) ?? -1

  let [nextColorIndex, setNextColorIndex] = useState<number>(lastColorIndex+1);

  return (
    <FlatList
      data={chefList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChefItem chef={item} chefList={chefList} setChefList={setChefList} />
      )}
      ListFooterComponent={() => (
        <View style={styles.chefItemContainer}>
          <Pressable
            style={styles.addChefButton}
            onPress={() => {
              setChefList([
                ...chefList,
                {
                  id: Date.now().toString(),
                  name: "",
                  color: chefColors[nextColorIndex], // TODO: randomize color from e.g. 8 ones, or always take the 4 ones that work best first
                  icon: require("../../assets/image/chefHatSmall.png"),
                },
              ]);
              setNextColorIndex((nextColorIndex + 1) % chefColors.length);
            }}
          >
            <View>
              <Image
                style={styles.addChefIcon}
                source={require("../../assets/image/Add_chef_icon.png")} //TODO: chef.image
                // check chef.color to decide color of border
              />
            </View>
            <Text style={styles.nameText}>Lägg till kock</Text>
          </Pressable>
        </View>
      )}
    />
  );
}



type ChefItemProps = {
  chef: any;
  chefList: any;
  setChefList: any;
};

/**
 * Listans rader
 * https://reactnative.dev/docs/image
 */
const ChefItem = ({ chef, chefList, setChefList }: ChefItemProps) => {
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

    function checkColor(col: ColorValue) {
      return col == chef.color.toString();
    }

    let colIndex = chefColors.findIndex(checkColor);
    //let colIndex = color.findIndex((c) => c == chef.color.toString());

    if (colIndex < chefColors.length - 1) {
      colIndex += 1;
    } else {
      colIndex = 0;
    }

    let tempChef: User = {
      id: chef.id,
      name: chef.name,
      color: chefColors[colIndex],
      icon: chef.icon,
    };

    newChefs.splice(index, 1, tempChef);
    return newChefs;
  }

  return (
    <View style={styles.chefItemContainer}>
      <Pressable
        style={[styles.chefColor, { backgroundColor: chef.color }]} //userColor,}
        onPress={() => {
          setChefList(
            editColor(chefList.findIndex((c: User) => c.id === chef.id), chef)
          );
        }}
      />
      <View style={styles.nameContainer}>
        <TextInput
          style={styles.nameText}
          placeholder="Skriv ditt namn..."
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
      <Pressable
        style={styles.deleteButton}
        onPress={() =>
          setChefList(chefList.filter((c: User) => c.id !== chef.id))
        }
      >
        <StandardText text={"X"} colorValue={"red"} textWeight={"bold"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  chefItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    paddingHorizontal: 15,
    paddingVertical: 20,
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
  chefColor: {
    height: 50,
    width: 50,
    borderRadius: 100,
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
  chefImageInList: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flex: 2,
  },
  nameText: {
    flex: 1,
    fontSize: 22,
    marginHorizontal: 10,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  deleteButton: {
    paddingRight: 10,
  },
  addChefButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  addChefIcon: {
    height: 50,
    width: 50,
  },
});

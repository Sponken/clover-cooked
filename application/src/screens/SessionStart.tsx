import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import React, { useState } from "react";

import { chefs as importedChefs, Chef } from "../data";

import { ChefsOverview } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";

//TODO: Vet inte om vi vill ha stack navigation här, eller om en vill kunna ändra i samma vy
type ChefManagementScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChefManagement"
>;

type Props = {
  navigation: ChefManagementScreenNavigationProp;
  route: any;
};

/**
 * Skärm för att starta matlagningen, du har valt recept innan denna
 */

export function SessionStart({ navigation, route }: Props) {
  //const [chefs, setChefs] = useState(importedChefs);

  let chefList;//: Chef[];
  if(route.params?.chefList === undefined){
    chefList = importedChefs;
  } else {chefList = route.params?.chefList.chefList}


  return (
    <View style={styles.container}>
      <Text style={styles.container}>
        TODO: Hamburgerknapp ska finnas här med
      </Text>
      <Text style={styles.container}>TODO: Visa bild på recept här</Text>
      <View style={{flex: 7}}>
        <ChefsOverview chefList={chefList}/>
      </View>
      <View style={{flex: 1}}>
        <Button
            title="Edit Chefs"
            onPress={() =>
              navigation.navigate("Chef Management", {
                chefList: {chefList} })
            }
         />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chefImageInList: {
    height: 30,
    width: 30,
  },
});

export default SessionStart;

import {
  StyleSheet,
  Image,
  View,
  Pressable,
  Text,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ChefList, StandardButton, StandardText, UserFastSwitcher} from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { User } from "../data";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/core";


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
 * Lista över kockar för hela tillagningen, skärm för att lägga till och redigera kockar
 */

export function ChefManagement({ navigation, route }: Props) {

  const [users, setUsers] = useState<User[]>(route.params?.users);

  //ifall ingen kock är tillagd så kan man inte klicka spara
  function sparaButtonSessionCheck() {
    if( users.length == 0){
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.titleContainer}>
        <StandardText text={"Redigera kockar"} size={"large"}/>
      </View>
        <View style={styles.flatListContainer}>
          <ChefList chefList={users} setChefList={setUsers}/>
        </View>
      <View style={styles.buttonContainer}>
      <StandardButton
        onPress={() => {sparaButtonSessionCheck()? null : navigation.navigate("SessionStart", {users})}}
        buttonText={sparaButtonSessionCheck() ? "Det måste finnas minst en kock" : "Spara"}
        buttonType={sparaButtonSessionCheck() ? "grey" : "primary"}
        textProps={{textWeight:"bold"}}
        />
      </View>
     <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "flex-end",
  },
  titleContainer:{
    height: "10%",
  },
  flatListContainer: {
    marginHorizontal:20,
    height: "70%",
  },
  buttonContainer:{
    alignItems:"center",
    marginBottom: 20,
    paddingTop:5,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
  canBePressed: {
    height: 60,
    width: 230,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#186C3B",
    flexDirection: "row",
  },
  cannotBePressed: {
    height: 60,
    width: 230,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "gray",
    flexDirection: "row",
  },
});



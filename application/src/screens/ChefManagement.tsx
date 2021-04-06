import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ChefList, StandardButton, StandardText} from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { User } from "../data";
import { SafeAreaView } from "react-native-safe-area-context";


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
        onPress={() => {navigation.navigate("SessionStart", {users})}}
        buttonText="Spara"
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
});



import {
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import { ChefList } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { Chef } from "../data";

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
  //console.log(route.params.chefList);

  const [chefList, setChefList] = useState(route.params?.chefList.chefList);

 // navigation.setOptions({headerLeft: () => <Button
 //   onPress={() => {   
 //     navigation.navigate("Session Start")
 //   }}
 //   title="Back"
 // />})

  return (
    <View style={styles.container}>
      <View style={{flex: 0.5}}>
        {/* TODO: not sure why content outside of screen */}
      </View>
      <View style={{flex: 1, justifyContent: "flex-start", flexDirection: 'row', paddingLeft: 10}}>
        <Button
          onPress={() => {   
            navigation.navigate("Session Start", {chefList: {chefList}})
          }}
          title="Back"
        />
      </View>
      {/* <View style={{flex: 1}}>
        <Button
          title="Log from ChefManagemnet"
          onPress={() => {
            console.log("Logging chefList using Chefmanagement button:")
            console.log(chefList)}}
        />
      </View> */}
      
      <View style={{flex: 7}}>
        <ChefList chefList={chefList} setChefList={setChefList}/>
      </View>

      <View style={{flex: 1}}>
        <TouchableOpacity
        style={{
          margin: 10,
          height: 75,
          width: 75,
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 75 * 2,
          flexDirection: "row",
          
        }}
        onPress={() => {
          setChefList([
            ...chefList,
            {
              id: Date.now().toString(),
              name: "New User",
              color: "Blue",
              image: "todo",
            },
          ]);
        }}
        >
          
          <Image 
            style={styles.chefImageInList}
            source={require("../../assets/image/Add_chef_icon.png")} //TODO: chef.image
            // check chef.color to decide color of border
          />
          <Text>Add New Chef</Text>
        </TouchableOpacity>

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

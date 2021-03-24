import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import { ChefList } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { User } from "../data";


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
    <View style={styles.container}>
      <View style={{flex: 1}}>
        {/* TODO: not sure why content outside of screen */}
      </View>
      <View style={{flex: 1, justifyContent: "flex-start", flexDirection: 'row', paddingLeft: 10}}>
        
        <Pressable style={styles.doneContainer} onPress={() => {   
            navigation.navigate("SessionStart", {users})
          }}>
          <Text style={{fontSize: 18, color:"white", fontWeight: "bold"}}>Klar</Text>
        </Pressable>
        
      </View>

      
      <View style={{flex: 8}}>
        <ChefList chefList={users} setChefList={setUsers}/>
      </View>

      <View style={{flex: 1, alignItems: "flex-start", justifyContent: "flex-start", margin: 60}}>
        <TouchableOpacity
        style={{
          margin: 10,
          height: 50,
          width: 150,
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 75 * 2,
          flexDirection: "row",
          
          
        }}
        onPress={() => {
          setUsers([
            ...users,
            {
              id: Date.now().toString(),
              name: "New User",
              color: "#5884E0", // TODO: randomize color from e.g. 8 ones, or always take the 4 ones that work best first
              icon: null
            },
          ]);
        }}
        >
          
          <Image 
            style={{height: 60,
              width: 60, margin: 20}}
            source={require("../../assets/image/Add_chef_icon.png")} //TODO: chef.image
            // check chef.color to decide color of border
          />
          <Text style={{fontSize: 24}}>Add New Chef</Text>
        </TouchableOpacity>

      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  doneContainer: {
    padding: 10,
    height: 40,
    backgroundColor: "green",
    borderRadius: 8,
  },
  
});



import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { StatusBar } from "expo-status-bar";

import React from "react";

import { ChefsOverview } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";


import { Recipe, User, recipes } from "../data";
import { DrawerActions } from "@react-navigation/routers";

import { getRecipeThumbnail } from "../data";

//TODO: Vet inte om vi vill ha stack navigation här, eller om en vill kunna ändra i samma vy
type ChefManagementScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChefManagement"
>;

//TODO: ta emot recipe från RecipeOverview och spara som state här?
//TODO: ha default cooks här?
type Props = {
  navigation: ChefManagementScreenNavigationProp;
  route: any;
};

// Exempelkod för att matlagnings skärmen skall fungera
const example_recipe = recipes[0];
const example_users = [
  {
    id: "1",
    name: "Test User",
    color: "#EB4F40",
    icon: null //require("../../assets/image/icon.png"),
  }
];

/**
 * Skärm för att starta matlagningen, du har valt recept innan denna
 */

export function SessionStart({ navigation, route }: Props) {
  console.log(route.params?.users);

  let recipe: Recipe;
  let users: User[];

  //Initiera users och recipe om de inte finns
  if(route.params?.users === undefined){
    users = example_users;
  } else {users = route.params?.users}

  if(route.params?.recipe === undefined){
    recipe = example_recipe;
  } else {recipe = route.params?.recipe}
  
  return (
    <SafeAreaView style={styles.container}>

      <View style={{ flex: 1, padding: 10, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between"}}>
        <TouchableOpacity
          style={{
            margin: 10,
            height: 30,
            width: 30,
            
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30 * 2,
            flexDirection: "row",
          }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Image
            style={styles.chefImageInList}
            source={require("../../assets/image/hamburger.png")} //TODO: chef.image
            // check chef.color to decide color of border
          />

        </TouchableOpacity>
        <View style={{alignItems: "flex-end", justifyContent: "flex-end"}}>
          <TouchableOpacity
              style={{
                margin: 10,
                height: 40,
                width: 70,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: "red",

              }}
              onPress={() =>{
                navigation.navigate("RecipeLibrary")
              } 
              }
            >
              <Text style={{color: "white", fontWeight: "bold"}}>Cancel</Text>

            </TouchableOpacity>

        </View>
        
      </View>

      <View style={{alignItems: "center", justifyContent: "space-between"}}>
        <Text style={{fontSize: 20, margin: 10}}>{recipe.name}</Text>

      <Image
          style={{height: 150, width: 300, borderRadius: 10}}
          source={getRecipeThumbnail(recipe.id)}
        />
      </View>
      
      {/* <View style={{height: 10}}>
        
        </View> */}

      {/* example_recipe.icon */}
      <View style={{ flex: 10, justifyContent: "center" }}>
        <ChefsOverview users={users} nav={navigation}/>
      </View>      

      {/* Conditional: ska visa "Fortsätt" om det redan är startat */}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", margin: 10}}>
      <TouchableOpacity
        style={{
          height: 70,
          width: 250,
          alignItems: "center",
          // justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#186C3B",
          flexDirection: "row",
          margin: 20,
        }}
        onPress={() =>{
          navigation.navigate("Cooking", {
            recipe,
            users
          })
        } 
        }
      >
        
        <Image
          style={{height: 32, width: 24, margin: 15, marginLeft: 63}}
          source={require("../../assets/image/play-button.png")} //TODO: chef.image
          // check chef.color to decide color of border
        />

        <Text style={{color: "white", fontSize: 32}}>Starta</Text>
        


      </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // flexDirection: "column"
  },
  chefImageInList: {
    height: 30,
    width: 30,
  },
  startButton: {
    height: 30,
    width: 30,
  },
});

export default SessionStart;

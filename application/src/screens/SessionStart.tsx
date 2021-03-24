import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
  Pressable
} from "react-native";
import { StatusBar } from "expo-status-bar";

import React from "react";

import { ChefsOverview } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";


import { Recipe, User, recipes } from "../data";
import { DrawerActions } from "@react-navigation/routers";

import { getRecipeThumbnail } from "../data";
import { ScreenContainer } from "react-native-screens";

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
    icon: require("../../assets/image/icon.png"),
  }
];

/**
 * Skärm för att starta matlagningen, du har valt recept innan denna
 */

export function SessionStart({ navigation, route }: Props) {

  let recipe: Recipe;
  let users: User[];

  //Initiera users och recipe om de inte finns
  if(route.params?.users === undefined){
    users = example_users;
  } else {users = route.params?.users}

  if(route.params?.recipe === undefined){
  } else {recipe = route.params?.recipe}

  const EmptyRecipeCheck = () => {
    if(recipe === undefined){
      return(
        <View style={{height: 155}}>
        <Text style={{fontSize: 20, margin: 50, justifyContent: "center",}}> No recipe chosen </Text>
        </View>
      )
    }
    else{
      return (
        <View style={{alignItems: "center", justifyContent: "space-between"}}>
        <Text style={{fontSize: 20, margin: 10}}>{recipe.name}</Text>

      <Image
          style={{height: 150, width: 300, borderRadius: 10}}
          source={getRecipeThumbnail(recipe.id)}
        />
      </View>
      )
    }
  }

  function startButtonSessionCheck() {
    if(route.params?.recipe === undefined){
      return true;
    }
    else {
      return false;
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.topContainer}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <View>
            <Image
              style={styles.hamburgerContainer}
              source={require("../../assets/image/hamburger.png")}
            />
          </View>

            
        </Pressable>

        <View style={styles.titleContainer}></View>

        <Pressable
          style={styles.deleteSession}
          onPress={() =>{{
            navigation.setParams({ recipe: undefined })
            navigation.navigate("RecipeLibrary", {
              screen: "RecipeLibrary"
              })
            }} 
          }>
          <Text style={{color: "white", fontWeight: "bold"}}>Delete Session</Text>
        </Pressable>

        {/*Vien under är fulhack för att centrera texten på hela skärmen*/}
        <View style={styles.topContainer}></View>
      </View>

      <EmptyRecipeCheck />
      

      {/* <View style={{height: 10}}>
        
        </View> */}

      {/* example_recipe.icon */}
      <View style={{ flex: 10, justifyContent: "center" }}>
        <ChefsOverview users={users} nav={navigation}/>
      </View>      

      {/* Conditional: ska visa "Fortsätt" om det redan är startat */}

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", margin: 10}}>
      
      <Pressable disabled={startButtonSessionCheck()} 
        style={startButtonSessionCheck() ? styles.cannotBePressed : styles.canBePressed} 
        onPress={() =>{navigation.navigate("Cooking", {recipe,users})} }
      >
        <Image
          style={{height: 32, width: 24, margin: 15, marginLeft: 63}}
          source={require("../../assets/image/play-button.png")} //TODO: chef.image
          // check chef.color to decide color of border
        />
        <Text style={{color: "white", fontSize: 32}}>Starta</Text>
      </Pressable>
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

  drawer: {
    margin: 10,
    height: 30,
    width: 30,
    
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30 * 2,
    flexDirection: "row",
  },

  topContainer: {
    height: 30,
    flexDirection: "row",
    margin: 10,
  },
  hamburgerContainer: {
    height: 30,
    width: 30,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },

  deleteSession:{

    
    height: 40,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "red",
  },

  chefImageInList: {
    height: 30,
    width: 30,
  },
  startButton: {
    height: 30,
    width: 30,
  },
  canBePressed: {
    height: 70,
    width: 250,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#186C3B",
    flexDirection: "row",
    margin: 20,
  },
  cannotBePressed: {
    height: 70,
    width: 250,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "gray",
    flexDirection: "row",
    margin: 20,

  },
});


export default SessionStart;

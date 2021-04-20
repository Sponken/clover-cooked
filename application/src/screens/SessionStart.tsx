import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import React, { useState, useContext } from "react";

import { ChefsOverview, StandardButton, StandardText } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";


import { Recipe, User, recipes } from "../data";
import { DrawerActions } from "@react-navigation/routers";

import { getRecipeThumbnail } from "../data";


import { schedulerContext } from "./scheduler-context";

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

/**
 * Skärm för att starta matlagningen, du har valt recept innan denna
 */

export function SessionStart({ navigation, route }: Props) {

  let initScheduler: Boolean;
  const {scheduler, setScheduler} = useContext(schedulerContext);

  

  //Kolla om vi har en scheduler, i nuläget testar den bara om vi startat recept
  if(route.params?.initScheduler === undefined){
  } else {initScheduler = route.params?.initScheduler}

  
  let recipe: Recipe;
  const [recipeInSession, setRecipeInSession] = useState<Recipe>()
  let users: User[] = [];

  //modal poppar upp som "är du säker på att du vill deleta denna session?"
  const [deleteSessionModalVisible, setDeleteSessionModalVisible] = useState(false);

  //Initiera users och recipe om de inte finns
  if(route.params?.users === undefined){
    users = []
  } else {users = route.params?.users}

  if(route.params?.recipe === undefined){
  }
  else if(scheduler){
    recipe = recipeInSession;
  }
  else {recipe = route.params?.recipe}

  const PrintRecipe = () => {
    if(recipe === undefined){
      return(
        <StandardText text={"Inget recept valt"}/>
      )
    } else {
      return (
        <View style={styles.recipeContainer}>
          <StandardText text={recipe.name}/>
          <Image
          style={styles.recipeImage}
          source={getRecipeThumbnail(recipe.id)}
          />
      </View>
      )
    }
  }

  function startButtonSessionCheck() {
    if(route.params?.recipe === undefined || users.length == 0){
      return true;
    }
    else {
      return false;
    }
  }

  function schedulerExist() {
    if(scheduler){
      return true;
    }
    else {
      return false;
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Modal
          visible={deleteSessionModalVisible}
          animationType="fade"
          onRequestClose={() => setDeleteSessionModalVisible(false)}
          transparent={true}
          statusBarTranslucent={true}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setDeleteSessionModalVisible(!deleteSessionModalVisible)}
          >
            <Pressable style={styles.modalContainer} onPress={() => null}>
              <View style={styles.modalTextContainer}>
              <StandardText text={"Vill du radera denna matlagningssession?"}/>
              </View>
              <View style={styles.modalButtonsContainer}>
                <StandardButton buttonType={"secondary"} buttonText={"Avbryt"} onPress={() => setDeleteSessionModalVisible(!deleteSessionModalVisible)}/>
                <View style={{width: "10%" }}/>
                <StandardButton buttonText={"Ta bort receptet"} onPress={() => 
                {{
                  setDeleteSessionModalVisible(false);
                  setScheduler();
            navigation.setParams({ recipe: undefined }),
            navigation.navigate("RecipeLibrary", {
              screen: "RecipeLibrary"
              })
                }}} />
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
        <View style={styles.topContainerSpace}></View>
        <Pressable
          onPress={() =>{{
            setDeleteSessionModalVisible(true)}}}>
            <View style={styles.deleteSession}>
          <Text style={{color: "white", fontWeight: "bold"}}>Radera</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.allRecipesContainer}>
        <PrintRecipe />
      </View>

      <View style={styles.chefsContainer}>
        <ChefsOverview users={users} nav={navigation} recipeActivated={schedulerExist()}/>
      </View>      

      {/* Conditional: ska visa "Fortsätt" om det redan är startat */}
      {/* när schedulen inte skickas med: "börja om" istället för fortsätt */}
      <View style={styles.buttonContainer}>
      
      <Pressable disabled={startButtonSessionCheck()} 
        style={startButtonSessionCheck() ? styles.cannotBePressed : styles.canBePressed} 
        onPress={() =>{
            if(!schedulerExist()){setRecipeInSession(recipe)} // Om ett recept redan är startat
            {navigation.navigate("Cooking", {recipe, users})};
          }
        }
      >
        <Image
          style={{height: 32, width: 24, margin: 15, marginLeft: 40}}
          source={require("../../assets/image/play-button.png")} //TODO: chef.image
          // check chef.color to decide color of border
        />
        <Text style={{color: "white", fontSize: 32}}>{scheduler ? "Fortsätt" : "Starta"}</Text>
      </Pressable>
      </View>

      {/*<StatusBar style="auto" />*/}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(160, 160, 160, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "40%",
    width: "85%",
    borderRadius: 10,
  },
  modalTextContainer:{
    justifyContent: "center",
    height: "70%",
  },
  modalButtonsContainer:{
    flexDirection: "row",
    justifyContent: "center",
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
  topContainerSpace: {
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
    backgroundColor: "#ed4040",
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
  allRecipesContainer:{
    alignItems: "center",
    justifyContent: "center",
    height: "25%",
    margin: 10,
  },
  recipeContainer:{
    width: "80%",
  },
  recipeImage:{
    height: "80%", 
    width: "90%", 
    borderRadius: 10,
    alignSelf:"center",
    marginTop:8,
  },
  chefsContainer:{ 
    height: "50%",
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
    
  chefImageInList: {
    height: 30,
    width: 30,
  },
  buttonContainer:{ 
    alignItems: "center", 
    justifyContent: "center", 
    margin: 20,
  },
  startButton: {
    height: 30,
    width: 30,
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


export default SessionStart;

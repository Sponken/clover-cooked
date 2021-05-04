import {
  StyleSheet,
  Image,
  View,
  Modal,
  Pressable,
  FlatList,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Progress from 'react-native-progress';

import React, { useState, useContext } from "react";

import { ChefsOverview, StandardButton, StandardText } from "../components";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";


import { Recipe, User } from "../data";
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

  let progressListComponent: JSX.Element;

  //Kolla om vi har en scheduler, i nuläget testar den bara om vi startat recept
  if(route.params?.initScheduler === undefined){
  } else {initScheduler = route.params?.initScheduler}

  
  let recipe: Recipe;
  const [recipeInSession, setRecipeInSession] = useState<Recipe>()
  let users: User[] = [];

  //modal poppar upp som "är du säker på att du vill deleta denna session?"
  const [deleteSessionModalVisible, setDeleteSessionModalVisible] = useState(false);

  //modal poppar upp som "det måste finnas åtminstonde en kock för att starta"
  const [chefModalVisible, setChefModalVisible] = useState(false);

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
          <View style={styles.recipeImageAndDeleteContainer}>
          
            <Image
            style={styles.recipeImage}
            source={getRecipeThumbnail(recipe.id)}
            />
              <View style={styles.deleteContainer}>
                <StandardButton onPress={() =>{scheduler ? setDeleteSessionModalVisible(true): navigation.navigate("RecipeLibrary", {
              screen: "RecipeLibrary"
              })}}
                buttonIcon={<Image style={styles.deleteIcon}source={require("../../assets/image/deleteWhite.png")}
                />}
                buttonSize={"small"}
                buttonType={"black"}
                />
              </View>
          </View>
          <StandardText text={recipe.name} textWeight={"bold"}/>
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

  if(scheduler){
    progressListComponent = (
      <View style={styles.progressContainer}>
        <FlatList
          style={{flexGrow: 0}}
          data={scheduler.getBranchProgress()}
          keyExtractor={([branch, progress]) => branch}
          renderItem={({ item }) => (
              <View style={{flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center"}}>
                <Text style={{width: "25%"}}>{item[0]}</Text>
                <Progress.Bar color="green" height={15} unfilledColor="lightgrey" borderWidth={0} progress={item[1]} width={null} style={{width:"50%"}}/>
                <Text style={{width: "15%", paddingLeft: 5 }}>{Math.round(item[1]*100)}%</Text>
              </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 5,
              }}
            />
          )}
          contentContainerStyle={{}}
        />
      </View>
    )
  }
  else{
    progressListComponent = <></>
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
              <StandardText text={"Receptet är inte klart,"}/>
              <StandardText text={"vill du ändå avsluta matlagningen?"}/>
              </View>
              <View style={styles.modalButtonsContainer}>
                <StandardButton buttonType={"secondary"} buttonText={"Avbryt"} onPress={() => setDeleteSessionModalVisible(!deleteSessionModalVisible)}/>
                <View style={{width: "5%" }}/>
                <StandardButton buttonText={"Avsluta receptet"} onPress={() => 
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
        <Modal
          visible={chefModalVisible}
          animationType="fade"
          onRequestClose={() => setChefModalVisible(false)}
          transparent={true}
          statusBarTranslucent={true}
        >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setChefModalVisible(!chefModalVisible)}
        >
          <Pressable style={styles.modalContainer} onPress={() => null}>
            <View style={styles.modalTextContainer}>
            <StandardText text={"Du behöver minst en kock och ett recept för att påbörja ett recept"} textNumbOfLines={2}/>
            </View>
            <View style={styles.modalButtonsContainer}>
              <StandardButton buttonText={"Ok"} onPress={() => setChefModalVisible(!chefModalVisible)} />
            </View>
          </Pressable>
        </Pressable>
        </Modal>
      <View style={styles.innerContainer}>
        <View style={styles.topContainer}>
          <Pressable
          style={{justifyContent: "center"}}
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
        </View>

        <View style={styles.allRecipesContainer}>
          <PrintRecipe />
        </View>

        <View style={styles.chefsContainer}>
          <ChefsOverview users={users} nav={navigation} recipeActivated={schedulerExist()}/>
        </View>      

        {progressListComponent}
        <View style={styles.buttonContainer}>
          

          <View style={styles.buttonContainer}>
            <StandardButton buttonText={scheduler ? "Fortsätt" :"Påbörja matlagning"}
              textProps={{textWeight:"bold"}}
              buttonType={startButtonSessionCheck() ? "passive" : "primary"}
              onPress={() =>{
                if(!schedulerExist()){setRecipeInSession(recipe)} // Om ett recept redan är startat
                {startButtonSessionCheck() ? setChefModalVisible(true): navigation.navigate("Cooking", {recipe, users})};
              }}
              buttonIcon={<Image
                style={{marginLeft: 10, height: 25, width: 20}}
                source={require("../../assets/image/play-button.png")}/>}
            />
          </View>
        </View>
      
      </View>
      {/*<StatusBar style="auto" />*/}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection:"column",
    alignItems: "stretch",
    width: "95%",
    height: "100%"
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(87, 87, 87, 0.6)",
  },
  modalContainer: {
    backgroundColor: "white",
    height: "35%",
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
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
  },
  hamburgerContainer: {
    height: 30,
    width: 30,
    marginLeft: 6,
  },
  topContainerSpace: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },

  allRecipesContainer:{
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  recipeContainer:{
    width: "75%",
    height:"90%"
  },
  recipeImageAndDeleteContainer:{
    flex: 1
  },
  recipeImage:{
    height: "90%", 
    width: "90%", 
    borderRadius: 4,
    alignSelf:"center",
    marginTop:8,
  },
  deleteContainer:{
    position: "absolute",
    top: -5,
    alignSelf: "flex-end",
  },
  deleteIcon:{
    height: 17,
    width: 17,
  },

  chefsContainer:{
    flexShrink: 0,
    flexGrow: 1.5,
    flexBasis: 0,
    justifyContent: "center",
  },
    
  chefImageInList: {
    height: 30,
    width: 30,
  },

  progressContainer: {
    flexShrink: 3,
    flexGrow: 0,
    padding: 5,
    justifyContent: "center",
    alignItems: "center", 
  },

  buttonContainer:{
    flex: 0.7,
    alignItems: "center", 
    justifyContent: "center", 
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

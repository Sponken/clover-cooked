import {
  StyleSheet,
  View,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ChefList, StandardButton, StandardText} from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation";
import { User } from "../data";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";


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

  const [modalVisible, setModalVisible] = useState(false);

  function onSubmit(){
    navigation.navigate("SessionStart", {users})
  }
  
  //ifall ingen kock är tillagd så kan man inte klicka spara
  function sparaButtonSessionCheck() {
    if( users.length == 0 || (users.some(u => u.name === ""))){
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <SafeAreaView style={styles.screenContainer}>

<Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        statusBarTranslucent={true}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Pressable style={styles.modalContainer} onPress={() => null}>
            <View style={styles.modalTextContainer}>
              <StandardText text={"Du behöver minst en kock och"} />
              <StandardText text={"alla kockar behöver ett namn"} />
            </View>
            <View style={styles.modalButtonsContainer}>
              <StandardButton
                buttonText={"Ok"}
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.titleContainer}>
        <StandardText text={"Redigera kockar"} size={"large"}/>
      </View>
        <View style={styles.flatListContainer}>
          <ChefList chefList={users} setChefList={setUsers}/>
        </View>
      <View style={styles.buttonContainer}>
        {/* Fulhack pga tidsbrist */}
        <View style = {{padding: 5}}>
          <StandardButton
            
            onPress={() => {sparaButtonSessionCheck()? setModalVisible(true) : onSubmit()}}
            buttonText={ "Spara"}
            buttonType={sparaButtonSessionCheck() ? "passive" : "primary"}
            />
        </View>
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



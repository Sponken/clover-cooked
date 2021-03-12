import { StyleSheet, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation";
import { UserFastSwitcher, TaskCard, TaskConfirm } from "../components";
import { User } from "../data";
import { unsafeFind } from "../utils";

type CookingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cooking"
>;

type CookingRouteProp = RouteProp<RootStackParamList, "Cooking">;

type Props = {
  navigation: CookingScreenNavigationProp;
  route: CookingRouteProp;
};

type AssignedTask = {
  userId: string;
  taskId: string;
};

/**
 * Cooking, skärmen som visas under tiden matlagningen sker
 */
export function Cooking({ navigation, route }: Props) {
  //const { recipe, users } = route.params;
  //console.log("User in cooking: " + route.params?.users[0]);
  //console.log("Listing route users")
  //console.log(route.params?.recipe)
  const users = route.params?.users.chefList;
  const recipe = route.params?.recipe.example_recipe;

  const [activeUser, setActiveUser] = useState(users[0].id); //id på aktiv användare
  const [userNotifications, setUserNotifications] = useState<string[]>([]); //lista med användarid som är notifierade
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]); //lista med användarid och dess taskid
  const [passiveTasks, setPassiveTasks] = useState<string[]>([]); //lista med passiva task som är frikopplade från användare

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBarContainer}>
        <View style={{ flex: 1, flexDirection: "column-reverse" }}>
          <UserFastSwitcher
            users={users}
            activeUser={activeUser}
            userNotifications={userNotifications}
            onActiveUserSwitch={(userId: string) => setActiveUser(userId)}
          />
        </View>
        <View style={styles.topBarRightMenu}>
          <Pressable>
            <Image
              source={require("../../assets/image/icon.png")} //Placeholder tills ikon finns
              style={styles.topBarRightMenuIcon}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("../../assets/image/icon.png")} //Placeholder tills ikon finns
              style={styles.topBarRightMenuIcon}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <TaskCard
          taskId={recipe.tasks[1].id} //Exempel kod, då användare inte än kan få tasks
          //taskId={unsafeFind(assignedTasks, (o: AssignedTask) => o.userId == activeUser)}
          recipe={recipe}
          userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
          userColor={unsafeFind(users, (u: User) => u.id == activeUser).color}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TaskConfirm //Exempel kod för att visa knappar
          confirmType={"extendOrFinish"}
          onExtendPress={() => null}
          onFinishPress={() => null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  topBarContainer: {
    flexDirection: "row",
  },
  topBarRightMenu: {
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  topBarRightMenuIcon: {
    width: 44,
    height: 44,
    margin: 3,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    height: 100,
    alignItems: "center",
  },
});

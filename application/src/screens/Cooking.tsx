import { StyleSheet, View, Pressable, Image, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation";
import {
  UserFastSwitcher,
  TaskCard,
  TaskConfirm,
  CookingTimer,
} from "../components";
import { User } from "../data";
import { unsafeFind } from "../utils";
import { createBasicScheduler, Scheduler } from "../scheduler";

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
  const { recipe, users } = route.params;

  const [activeUser, setActiveUser] = useState(users[0].id); //id på aktiv användare
  const [userNotifications, setUserNotifications] = useState<string[]>([]); //lista med användarid som är notifierade
  const [passiveTasks, setPassiveTasks] = useState<string[]>([]); //lista med passiva task som är frikopplade från användare

  // Varje userid har en associerad task
  //
  // HACK: När man ska ändra ett värde i setAssignedTasks måste man skriva
  // `setAssignedTasks(new Map(assignedTasks.set(key, new_value)));`
  // för att värdet ska uppdateras i react-trädet.
  // Source: https://medium.com/swlh/using-es6-map-with-react-state-hooks-800b91eedd5f
  const [assignedTasks, setAssignedTasks] = useState<
    Map<string, string | undefined>
  >(new Map());

  const [scheduler, setScheduler] = useState<Scheduler>();
  useEffect(() => {
    const taskAssignedSubscriber = (task: string | undefined, cook: string) => {
      console.log("task assigned " + task + " to " + cook);
      setAssignedTasks((assigned) => new Map(assigned.set(cook, task)));
    };

    const passiveTaskStartedSubscriber = (task: string, finish: Date) => {
      // TODO: Hur hanteras passiva tasks?
    };
    let cooks = users.map((u) => u.id);
    let ssss: Scheduler = createBasicScheduler(recipe, cooks);
    const taskAssignedUnsubscribe = ssss.subscribeTaskAssigned(
      taskAssignedSubscriber
    );
    const passiveTaskUnsubscribe = ssss.subscribePassiveTaskStarted(
      passiveTaskStartedSubscriber
    );
    setAssignedTasks(ssss.getTasks());
    setScheduler(ssss);
    return () => {
      taskAssignedUnsubscribe();
      passiveTaskUnsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topBarContainer}>
        <View style={{ flex: 1, flexDirection: "column-reverse" }}>
          <UserFastSwitcher
            users={users}
            activeUser={activeUser}
            userNotifications={userNotifications}
            onActiveUserSwitch={(userId: string) => {
              setActiveUser(userId);
            }}
          />
        </View>
        <View style={styles.topBarRightMenu}>
          <Pressable onPress={() => navigation.navigate("SessionStart")}>
            <Image
              source={require("../../assets/image/editChef.png")} //Placeholder tills ikon finns
              style={styles.topBarRightMenuIcon}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("../../assets/image/icon.png")} // TODO: Placeholder tills ikon finns
              style={styles.topBarRightMenuIcon}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.timerContainer}>
          <CookingTimer
            onPress={() => null}
            finish={new Date(Date.now() + 80000)}
            displayRemainingTime={"hidden"}
          />
        </View>
        <TaskCard
          taskId={assignedTasks.get(activeUser)}
          recipe={recipe}
          userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
          userColor={unsafeFind(users, (u: User) => u.id == activeUser).color}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TaskConfirm //Exempel kod för att visa knappar
          confirmType={"extendOrFinish"}
          onExtendPress={() => null}
          onFinishPress={() => {
            let a = activeUser;
            let t = assignedTasks.get(a);
            setAssignedTasks((assigned) => {
              assigned.delete(a);
              return new Map(assigned);
            });

            if (t) {
              // TODO: Says scheduler may be undefined... but it is initialized in useEffect.
              scheduler.finishTask(t, a);
            }
          }}
        />
      </View>
    </SafeAreaView>
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
  timerContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  buttonContainer: {
    height: 100,
    alignItems: "center",
  },
});

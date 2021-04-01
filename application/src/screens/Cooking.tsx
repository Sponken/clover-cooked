import { StyleSheet, View, Pressable, Image, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation";
import { UserFastSwitcher, TaskCard, TaskConfirm } from "../components";
import { User } from "../data";
import { unsafeFind, undefinedToBoolean } from "../utils";
import {
  createBasicScheduler,
  Scheduler,
  PassiveTaskSubscriber,
  TaskAssignedSubscriber,
  RecipeFinishedSubscriber,
} from "../scheduler";

type CookingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cooking"
>;

type CookingRouteProp = RouteProp<RootStackParamList, "Cooking">;

type Props = {
  navigation: CookingScreenNavigationProp;
  route: CookingRouteProp;
};

/**
 * Cooking, skärmen som visas under tiden matlagningen sker
 */
export function Cooking({ navigation, route }: Props) {
  const { recipe, users /*initScheduler*/ } = route.params;

  const [activeUser, setActiveUser] = useState(users[0].id); //id på aktiv användare
  const [userNotifications, setUserNotifications] = useState<
    Map<string, boolean>
  >(new Map()); //lista med användarid som är notifierade
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

  const taskAssignedSubscriber = (task: string | undefined, cook: string) => {
    console.log("task assigned " + task + " to " + cook);

    setAssignedTasks((assigned) => new Map(assigned.set(cook, task)));
    if (task !== undefined) {
      setUserNotifications(
        (notifications) => new Map(notifications.set(cook, true))
      );
    }
  };

  const recipeFinishedSubscriber: RecipeFinishedSubscriber = () => {
    console.log("recipe finished");
    navigation.navigate("RecipeFinished");
  };

  const passiveTaskStartedSubscriber = (task: string, finish: Date) => {
    // TODO: Hur hanteras passiva tasks?
  };

  // Fixar så det inte står en notis på den aktiva användaren
  if (undefinedToBoolean(userNotifications.get(activeUser))) {
    setUserNotifications(
      (notifications) => new Map(notifications.set(activeUser, false))
    );
  }

  useEffect(() => {
    let userIds = users.map((u) => u.id);
    let ssss: Scheduler = createBasicScheduler(recipe, userIds);
    const taskAssignedUnsubscribe = ssss.subscribeTaskAssigned(
      taskAssignedSubscriber
    );
    const passiveTaskUnsubscribe = ssss.subscribePassiveTaskStarted(
      passiveTaskStartedSubscriber
    );
    const recipeFinishedUnsubscribe = ssss.subscribeRecipeFinished(
      recipeFinishedSubscriber
    );
    setAssignedTasks(ssss.getTasks());

    let _userNotifications = new Map<string, boolean>();
    ssss
      .getTasks()
      .forEach((task, user) =>
        _userNotifications.set(user, task !== undefined && user !== activeUser)
      );
    setUserNotifications(new Map(_userNotifications));
    setScheduler(ssss);

    return () => {
      taskAssignedUnsubscribe();
      passiveTaskUnsubscribe();
      recipeFinishedUnsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.topBarContainer}>
        <View style={{ flex: 1, flexDirection: "column-reverse" }}>
          <UserFastSwitcher
            users={users}
            activeUser={activeUser}
            userNotifications={new Map(userNotifications)}
            onActiveUserSwitch={(userId: string) => {
              setUserNotifications(
                (notifications) => new Map(notifications.set(userId, false))
              );
              setActiveUser(userId);
            }}
          />
        </View>
        <View style={styles.topBarRightMenu}>
          <Pressable
            onPress={() => {
              navigation.navigate("SessionStart", { initScheduler: true });
            }}
          >
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
        <TaskCard
          taskId={assignedTasks.get(activeUser)}
          recipe={recipe}
          userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
          userColor={unsafeFind(users, (u: User) => u.id == activeUser).color}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TaskConfirm //Exempel kod för att visa knappar
          confirmType={"finish"}
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
  buttonContainer: {
    height: 100,
    alignItems: "center",
  },
});

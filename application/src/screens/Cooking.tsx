import {
  StyleSheet,
  View,
  Pressable,
  Image,
  SafeAreaView,
  Modal,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../navigation";
import {
  UserFastSwitcher,
  TaskCard,
  TaskConfirm,
  CookingTimer,
  CookingTimerOverview,
  TaskConfirmType,
} from "../components";
import { User } from "../data";
import { unsafeFind, undefinedToBoolean } from "../utils";
import { createBasicScheduler, Scheduler } from "../scheduler";
import { FlatList } from "react-native-gesture-handler";

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
  const { recipe, users } = route.params;

  const [activeUser, setActiveUser] = useState(users[0].id); //id på aktiv användare
  const [userNotifications, setUserNotifications] = useState<
    Map<string, boolean>
  >(new Map()); //lista med användarid som är notifierade
  const [passiveTasks, setPassiveTasks] = useState<Map<string, Date>>(
    new Map()
  ); //lista med passiva task som är frikopplade från användare

  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [earliestTimer, setEarliestTimer] = useState<Date | undefined>(
    undefined
  ); //date för nästa passiv task, undefined om inga finns

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

  //lista med de passiva tasks som visas som taskCards
  //(om de är klara kommer de upp för att säga ok avsluta passive task men även
  // om man trycker via modalen för att avsluta i förtid)
  const [visiblePassiveTasks, setVisiblePassiveTasks] = useState<string[]>([]);

  //taskId för det task som visas "stort", kommer oftast vara det assignedTask men ibland ett passivt task
  const [activeTask, setActiveTask] = useState<string>();
  const [taskConfirmType, setTaskConfirmType] = useState<TaskConfirmType>(
    "finish"
  );

  const updateEarliestTimer = (passiveTasks: Map<string, Date>) => {
    let _earliestTimer: undefined | Date = undefined;
    passiveTasks.forEach((finish) => {
      if (_earliestTimer) {
        if (finish.getTime() < _earliestTimer.getTime()) {
          _earliestTimer = new Date(finish);
        }
      } else {
        _earliestTimer = new Date(finish);
      }
    });
    setEarliestTimer(_earliestTimer);
  };

  const taskAssignedSubscriber = (task: string | undefined, cook: string) => {
    console.log("task assigned " + task + " to " + cook);
    setAssignedTasks((assigned) => new Map(assigned.set(cook, task)));
    if (task !== undefined) {
      setUserNotifications(
        (notifications) => new Map(notifications.set(cook, true))
      );
    }
  };

  const passiveTaskStartedSubscriber = (task: string, finish: Date) => {
    setPassiveTasks((tasks) => {
      tasks.set(task, finish);
      updateEarliestTimer(tasks);
      return new Map(tasks);
    });
  };

  const passiveTaskFinishedSubscriber = (task: string) => {
    setPassiveTasks((tasks) => {
      tasks.delete(task);
      updateEarliestTimer(tasks);
      return new Map(tasks);
    });
    setVisiblePassiveTasks((prevVisablePassiveTasks) =>
      prevVisablePassiveTasks.filter((t) => t !== task)
    );
  };

  const passiveTaskCheckFinishedSubscriber = (task: string) => {
    if (!visiblePassiveTasks.includes(task)) {
      setVisiblePassiveTasks((prevVisablePassiveTasks) => [
        task,
        ...prevVisablePassiveTasks,
      ]);
    }
  };

  useEffect(() => {
    let userIds = users.map((u) => u.id);
    let ssss: Scheduler = createBasicScheduler(recipe, userIds);
    const taskAssignedUnsubscribe = ssss.subscribeTaskAssigned(
      taskAssignedSubscriber
    );
    const passiveTaskStartedUnsubscribe = ssss.subscribePassiveTaskStarted(
      passiveTaskStartedSubscriber
    );
    const passiveTaskFinishedUnsubscribe = ssss.subscribePassiveTaskFinished(
      passiveTaskFinishedSubscriber
    );
    const passiveTaskCheckFinishedUnsubscribe = ssss.subscribePassiveTaskCheckFinished(
      passiveTaskCheckFinishedSubscriber
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
      passiveTaskStartedUnsubscribe();
      passiveTaskFinishedUnsubscribe();
      passiveTaskCheckFinishedUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (visiblePassiveTasks.length) {
      setActiveTask(visiblePassiveTasks[0]);
      setTaskConfirmType("extendOrFinish");
    } else {
      setActiveTask(assignedTasks.get(activeUser));
      setTaskConfirmType("finish");
    }
  }, [assignedTasks, activeUser, visiblePassiveTasks]);

  // Fixar så det inte står en notis på den aktiva användaren
  if (undefinedToBoolean(userNotifications.get(activeUser))) {
    setUserNotifications(
      (notifications) => new Map(notifications.set(activeUser, false))
    );
  }

  //skapar en lista av alla task (ev passiva o ev aktiva) som ska visas som minimized
  let minimizedTasks: string[] = [...visiblePassiveTasks];
  const userTask = assignedTasks.get(activeUser);
  if (userTask) {
    minimizedTasks.push(userTask);
  }
  minimizedTasks = minimizedTasks.filter((taskId) => taskId !== activeTask);
  const minimizedTasksComponent = (
    <FlatList
      contentContainerStyle={styles.minimizedTasksContainer}
      data={minimizedTasks}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            setActiveTask(item);
            setTaskConfirmType(
              item !== assignedTasks.get(activeUser)
                ? "extendOrFinish"
                : "finish"
            );
          }}
        >
          <TaskCard
            taskId={item}
            recipe={recipe}
            userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
            userColor={unsafeFind(users, (u: User) => u.id == activeUser).color}
            minimized={true}
          />
        </Pressable>
      )}
    />
  );

  if (scheduler) {
    // Skapa rätt knappar
    let taskConfirmButtons;
    switch (taskConfirmType) {
      case "finish":
        taskConfirmButtons = (
          <TaskConfirm
            confirmType={taskConfirmType}
            onFinishPress={() => {
              let t = activeTask;
              setAssignedTasks((assigned) => {
                assigned.delete(activeUser);
                return new Map(assigned);
              });
              if (t) {
                scheduler.finishTask(t, activeUser);
              }
            }}
          />
        );
        break;
      case "extendOrFinish":
        taskConfirmButtons = (
          <TaskConfirm
            confirmType={taskConfirmType}
            onFinishPress={() => {
              let t = activeTask;
              setAssignedTasks((assigned) => {
                assigned.delete(activeUser);
                return new Map(assigned);
              });
              if (t) {
                scheduler.finishTask(t, activeUser);
              }
            }}
            onExtendPress={() => {
              let t = activeTask;
              if (t) {
                scheduler.extendPassive(t);
              }
            }}
          />
        );
        break;
      case "finishOrContinue":
        taskConfirmButtons = (
          <TaskConfirm
            confirmType={taskConfirmType}
            onFinishPress={() => {
              let t = activeTask;
              setAssignedTasks((assigned) => {
                assigned.delete(activeUser);
                return new Map(assigned);
              });
              if (t) {
                scheduler.finishTask(t, activeUser);
              }
            }}
          />
        );
        break;
    }

    console.log("activeTask:", activeTask);
    console.log("visiblePassiveTasks:", visiblePassiveTasks);

    return (
      <SafeAreaView style={styles.screenContainer}>
        <Modal
          visible={timerModalVisible}
          animationType="fade"
          onRequestClose={() => setTimerModalVisible(false)}
          transparent={true}
          statusBarTranslucent={true}
        >
          <Pressable
            style={styles.modalScreenContainer}
            onPress={() => setTimerModalVisible(!timerModalVisible)}
          >
            <Pressable style={styles.timerModalContainer} onPress={() => null}>
              <CookingTimerOverview
                passiveTasks={passiveTasks}
                recipe={recipe}
                onPress={(taskId: string) => {
                  setTimerModalVisible(false);
                  setActiveTask(taskId);
                  setTaskConfirmType("finishOrContinue");
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
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
          <View style={{ width: "100%" }}>{minimizedTasksComponent}</View>

          <TaskCard
            taskId={activeTask}
            recipe={recipe}
            userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
            userColor={unsafeFind(users, (u: User) => u.id == activeUser).color}
          />
          <View style={styles.timerContainer}>
            <CookingTimer
              onPress={() => setTimerModalVisible(true)}
              finish={earliestTimer}
              displayRemainingTime={"hiddenUntilLow"}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>{taskConfirmButtons}</View>
      </SafeAreaView>
    );
  }
  return <></>;
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  modalScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(160, 160, 160, 0.5)",
  },
  timerModalContainer: {
    height: "40%",
    width: "85%",
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
  minimizedTasksContainer: {
    //width: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    width: "100%",
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

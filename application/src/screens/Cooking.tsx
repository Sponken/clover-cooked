import { StyleSheet, View, Pressable, Image, Modal, Text } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../navigation";
import {
  UserFastSwitcher,
  TaskCard,
  TaskConfirm,
  CookingTimer,
  CookingTimerOverview,
  TaskConfirmType,
  StandardText,
  StandardButton,
} from "../components";
import { User } from "../data";
import { unsafeFind, undefinedToBoolean } from "../utils";
import {
  createBasicScheduler,
  Scheduler,
  PassiveTaskSubscriber,
  TaskAssignedSubscriber,
  RecipeFinishedSubscriber,
} from "../scheduler";
import { FlatList } from "react-native-gesture-handler";

import { schedulerContext } from "./scheduler-context";

const OK_TIME_BETWEEN_CLICK = 700;

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
  const {scheduler, setScheduler} = useContext(schedulerContext);

  //lista med de passiva tasks som visas som taskCards, både i små o stor storlek
  //(om de är klara kommer de upp för att säga ok avsluta passive task men även
  // om man trycker via modalen för att avsluta i förtid)
  //(ett passivt task som ej är klart kommer ej läggas till här)
  const [visiblePassiveTasks, setVisiblePassiveTasks] = useState<string[]>([]);

  //passiva tasks som är igång med ännu ej är klara ska synas i modalen
  const [passiveTasksInModal, setPassiveTasksInModal] = useState<
    Map<string, Date>
  >(new Map());

  //taskId för det task som visas "stort", kommer oftast vara det assignedTask men ibland ett passivt task
  const [activeTask, setActiveTask] = useState<string>();
  const [taskConfirmType, setTaskConfirmType] = useState<TaskConfirmType>(
    "finish"
  );

  //vi använder denna variabel till att godkänna att vissa onPress är möjliga.
  //sätts till false när en knapp pressats -> timer -> sätts tillbaka till false
  const [okToPress, setOkToPress] = useState<Boolean>(true);

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
    setPassiveTasks((tasks) => {
      tasks.set(task, finish);
      return new Map(tasks);
    });
  };

  const passiveTaskFinishedSubscriber = (task: string) => {
    setPassiveTasks((tasks) => {
      tasks.delete(task);
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
    updateEarliestTimer(passiveTasks);
  }, [passiveTasks])

  useEffect(() => {
    let userIds = users.map((u) => u.id);
    let ssss: Scheduler;
    if (scheduler) {
      ssss = scheduler;
    } else {
      ssss = createBasicScheduler(recipe, userIds);
    }
    ssss.subscribeTaskAssigned(taskAssignedSubscriber);
    ssss.subscribePassiveTaskStarted(passiveTaskStartedSubscriber);
    ssss.subscribePassiveTaskFinished(passiveTaskFinishedSubscriber);
    ssss.subscribePassiveTaskCheckFinished(passiveTaskCheckFinishedSubscriber);
    ssss.subscribeRecipeFinished(recipeFinishedSubscriber);
    setAssignedTasks(ssss.getTasks());
    setPassiveTasks(ssss.getPassiveTasks());

    let _userNotifications = new Map<string, boolean>();
    ssss
      .getTasks()
      .forEach((task, user) =>
        _userNotifications.set(user, task !== undefined && user !== activeUser)
      );
    setUserNotifications(new Map(_userNotifications));
    setScheduler(ssss);

    return () => {
      console.log("UNSIBSCRIBING")
      ssss.unsubscribeTaskAssigned(taskAssignedSubscriber);
      ssss.unsubscribePassiveTaskStarted(passiveTaskStartedSubscriber);
      ssss.unsubscribePassiveTaskFinished(passiveTaskFinishedSubscriber);
      ssss.unsubscribePassiveTaskCheckFinished(passiveTaskCheckFinishedSubscriber);
      ssss.unsubscribeRecipeFinished(recipeFinishedSubscriber);
    };
  }, []);

  useEffect(() => {
    if (visiblePassiveTasks.length) {
      setActiveTask(visiblePassiveTasks[0]);
      setTaskConfirmType("extendOrFinish");
    } else {
      setActiveTask(assignedTasks.get(activeUser));
      if (assignedTasks.get(activeUser)) {
        setTaskConfirmType("finish");
      } else {
        //om ett task är undefined/"du har paus", så visas en grå knapp
        setTaskConfirmType("unavailable");
      }
    }

    //lägg in alla passiva task i modalen
    setPassiveTasksInModal(new Map(passiveTasks));
    passiveTasks.forEach((pDate, pTask) => {
      //ta bort från modalen om tasket finns med i visiblepassivetasks
      visiblePassiveTasks.forEach((vTask) => {
        if (vTask === pTask) {
          setPassiveTasksInModal((mTasks) => {
            mTasks.delete(vTask);
            return new Map(mTasks);
          });
        }
      });
    });
  }, [assignedTasks, activeUser, visiblePassiveTasks]);

  // Fixar så det inte står en notis på den aktiva användaren
  if (undefinedToBoolean(userNotifications.get(activeUser))) {
    setUserNotifications(
      (notifications) => new Map(notifications.set(activeUser, false))
    );
  }

  /*//om det bara finns en enda user så syns den inte, men om flera så syns alla
  let printUsers = <></>;
  if (users.length > 1) {
    printUsers = (
      <UserFastSwitcher
        users={users}
        activeUser={activeUser}
        userNotifications={userNotifications}
        onActiveUserSwitch={(userId: string) => {
          setActiveUser(userId);
        }}
      />
    );
  }*/

  //skapar en lista av alla task (ev passiva o ev aktiva) som ska visas som minimized
  let minimizedTasks: string[] = [...visiblePassiveTasks];
  const userTask = assignedTasks.get(activeUser);
  if (userTask && visiblePassiveTasks.length > 0) {
    minimizedTasks.push(userTask);
  }
  minimizedTasks = minimizedTasks.filter((taskId) => taskId !== activeTask);
  const minimizedTasksComponent = (
    <FlatList
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
              if (okToPress) {
                let t = activeTask;
                setAssignedTasks((assigned) => {
                  assigned.delete(activeUser);
                  return new Map(assigned);
                });
                if (t) {
                  scheduler.finishTask(t, activeUser);
                }
                setOkToPress(false);
                setTimeout(() => setOkToPress(true), OK_TIME_BETWEEN_CLICK);
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
              if (okToPress) {
                let t = activeTask;
                if (t) {
                  scheduler.finishPassiveTask(t);
                }
                setOkToPress(false);
                setTimeout(() => setOkToPress(true), OK_TIME_BETWEEN_CLICK);
              }
            }}
            onExtendPress={() => {
              if (okToPress) {
                let t = activeTask;
                if (t) {
                  scheduler.extendPassive(t);
                }
                setVisiblePassiveTasks((prevVisablePassiveTasks) =>
                  prevVisablePassiveTasks.filter((task) => task !== t)
                );
                setOkToPress(false);
                setTimeout(() => setOkToPress(true), OK_TIME_BETWEEN_CLICK);
              }
            }}
          />
        );
        break;
      case "interruptOrContinue":
        taskConfirmButtons = (
          <TaskConfirm
            confirmType={taskConfirmType}
            //klickat på interrupt/stäng av i förväg
            onFinishPress={() => {
              if (okToPress) {
                let t = activeTask;
                if (t) {
                  scheduler.finishPassiveTask(t);
                }
                setOkToPress(false);
                setTimeout(() => setOkToPress(true), OK_TIME_BETWEEN_CLICK);
              }
            }}
            //klickat på fortsätt/låt vara/avbryt inte
            onContinuePress={() => {
              if (okToPress) {
                //renderar om genom att kalla på något som startar useEffect
                let t = activeTask;
                setVisiblePassiveTasks((prevVisablePassiveTasks) =>
                  prevVisablePassiveTasks.filter((task) => task !== t)
                );
                setOkToPress(false);
                setTimeout(() => setOkToPress(true), OK_TIME_BETWEEN_CLICK);
              }
            }}
          />
        );
        break;
      case "unavailable":
        taskConfirmButtons = <TaskConfirm confirmType={taskConfirmType} />;
        break;
    }

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
                passiveTasks={passiveTasksInModal}
                recipe={recipe}
                onPress={(taskId: string) => {
                  setTimerModalVisible(false);
                  setActiveTask(taskId);
                  setTaskConfirmType("interruptOrContinue");
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
        <View style={styles.topBarContainer}>
          <View style={{ flex: 1, flexDirection: "column-reverse" }}>
            {/*printUsers*/}
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
            {/* <StandardButton
              buttonText={"Avbryt"}
              buttonType={"grey"}
              buttonSize={"small"}
              onPress={() => navigation.navigate("SessionStart")}
            /> */}
            <Pressable onPress={() => navigation.navigate("SessionStart", {})}>
              <Image
                source={require("../../assets/image/editChef.png")}
                style={styles.topBarRightMenuIcon}
                />
            </Pressable>
              {/*
            <Pressable>
              <Image
                source={require("../../assets/image/icon.png")} // TODO: Placeholder tills ikon finns
                style={styles.topBarRightMenuIcon}
              />
            </Pressable>*/}
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.spacingWithNoContent} />
          <View style={styles.minimizedTasksFlatListContainer}>
            {minimizedTasksComponent}
          </View>
          <View style={styles.activeTaskCardContainer}>
            <TaskCard
              taskId={activeTask}
              recipe={recipe}
              userName={unsafeFind(users, (u: User) => u.id == activeUser).name}
              userColor={
                unsafeFind(users, (u: User) => u.id == activeUser).color
              }
            />
          </View>
          <View style={styles.timerContainer}>
            <CookingTimer
              onPress={() => setTimerModalVisible(true)}
              finish={earliestTimer}
              displayRemainingTime="shown"
              size="large"
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
    //alignSelf: "flex-end", //det här är bara temp när vi har en avbryt knapp istället
    margin: 15, //det här är bara temp när vi har en avbryt knapp istället
  },
  topBarRightMenuIcon: {
    width: 44,
    height: 44,
    margin: 3,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  activeTaskCardContainer: {
    width: "95%",
  },
  spacingWithNoContent: {
    height: "6%",
  },
  minimizedTasksFlatListContainer: {
    width: "95%",
    height: "23%",
  },
  timerContainer: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  buttonContainer: {
    height: 100,
    alignItems: "center",
  },
});

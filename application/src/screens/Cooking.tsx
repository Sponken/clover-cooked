import { StyleSheet, View, Pressable, Image, Modal, Text } from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vibration, Platform } from 'react-native';
import { RootStackParamList } from "../navigation";
import {
  UserFastSwitcher,
  TaskCard,
  TaskConfirm,
  CookingTimer,
  CookingTimerOverview,
  TaskConfirmType,
  UndoButton,
  StandardButton,
} from "../components";
import { User, helpOrRestTaskID } from "../data";
import { unsafeFind, undefinedToBoolean, clearTimeoutOrUndefined } from "../utils";
import {
  createBasicScheduler,
  Scheduler,
  RecipeFinishedSubscriber,
} from "../scheduler";
import { FlatList } from "react-native-gesture-handler";
import * as Progress from 'react-native-progress';
import { Audio } from 'expo-av';

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

async function notify(vibrate: "short" | "long" | "none", sound?: string) {
  if (sound) {
    const eff = new Audio.Sound();
    switch (sound) {
      case "bell":
        await eff.loadAsync(require('../../assets/sound/bell.mp3'));
        break;
      case "alarm":
        await eff.loadAsync(require('../../assets/sound/alarm.mp3'));
        break;
    
      default:
        break;
    }
    await eff.playAsync();
  }
  switch (vibrate) {
    case "short":
      if (Platform.OS === 'ios') {
        Vibration.vibrate();
      } else {
        Vibration.vibrate([0, 400, 4600]);
      }
      break;
    case "long":
      if (Platform.OS === 'ios') {
        Vibration.vibrate([200, 200]);
      } else {
        Vibration.vibrate([0, 600, 200, 600, 4000]);
      }
      break;
    default:
      break;
  }
}

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

  // Lista med task som är slut men inte bekräftade av användaren
  const [visiblePassiveTasks, setVisiblePassiveTasks] = useState<string[]>([]);

  const [earliestInstr, setearliestInstr] = useState<String>();

  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [earliestTimer, setEarliestTimer] = useState<Date | undefined>(
    undefined
  ); //date för nästa passiv task, undefined om inga finns

  // Map från användare till deras senaste avklarade task
  const [lastFinishedTask, setLastFinishedTask] = useState<Map<string, string>>(
    new Map()
  );
  // Data för varje användares undoknapp
  type UndoData = {
    available: boolean;
    timeout?: NodeJS.Timeout;
  };

  const [undoData, setUndoData] = useState<Map<string, UndoData>>(new Map());

  // Varje userid har en associerad task
  //
  // HACK: När man ska ändra ett värde i setAssignedTasks måste man skriva
  // `setAssignedTasks(new Map(assignedTasks.set(key, new_value)));`
  // för att värdet ska uppdateras i react-trädet.
  // Source: https://medium.com/swlh/using-es6-map-with-react-state-hooks-800b91eedd5f
  const [assignedTasks, setAssignedTasks] = useState<
    Map<string, string | undefined>
  >(new Map());
  const { scheduler, setScheduler } = useContext(schedulerContext);
  const [ progress, setProgress ] = useState<number>(0);

  //taskId för det task som visas
  const [activeTask, setActiveTask] = useState<string>();
  const [taskConfirmType, setTaskConfirmType] = useState<TaskConfirmType>(
    "finish"
  );

  //vi använder denna variabel till att godkänna att vissa onPress är möjliga.
  //sätts till false när en knapp pressats -> timer -> sätts tillbaka till false
  const [okToPress, setOkToPress] = useState<Boolean>(true);

  const updateEarliestTimer = (passiveTasks: Map<string, Date>) => {
    let _earliestTimer: undefined | Date = undefined;
    let _earliestInstr: undefined | String = undefined;
    passiveTasks.forEach((finish, instr) => {
      if (_earliestTimer) {
        if (finish.getTime() < _earliestTimer.getTime()) {
          _earliestInstr = instr;
          _earliestTimer = new Date(finish);
        }
      } else {
        _earliestInstr = instr;
        _earliestTimer = new Date(finish);
      }
    });
    let a: undefined | string;
    if (recipe.tasks) {
      let b = recipe.tasks.find((t) => t.id == _earliestInstr);
      if (b) {
        a = b.instructions;
      }
    }
    setearliestInstr(a);
    setEarliestTimer(_earliestTimer);
  };

  const stateRef = useRef<string>();
  stateRef.current = activeUser;
  const taskAssignedSubscriber = (task: string | undefined, cook: string) => {
    setAssignedTasks((assigned) => new Map(assigned.set(cook, task)));
    if (task !== undefined && cook !== stateRef.current) {
      notify("short", "bell");
      setUserNotifications(
        (notifications) => new Map(notifications.set(cook, true))
      );
    }
  };

  const recipeFinishedSubscriber: RecipeFinishedSubscriber = () => {
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
  };

  const passiveTaskCheckFinishedSubscriber = (task: string) => {
    notify("long", "alarm");
    setTimerModalVisible(true);
  };
  const progressSubscriber = (progress: number) => {
    setProgress(progress)
  };

  useEffect(() => {
    updateEarliestTimer(passiveTasks);
  }, [passiveTasks]);

  useEffect(() => {
    let userIds = users.map((u) => u.id);
    let temporaryScheduler: Scheduler;
    if (scheduler) {
      temporaryScheduler = scheduler;
    } else {
      temporaryScheduler = createBasicScheduler(recipe, userIds);
    }
    temporaryScheduler.subscribeTaskAssigned(taskAssignedSubscriber);
    temporaryScheduler.subscribePassiveTaskStarted(passiveTaskStartedSubscriber);
    temporaryScheduler.subscribePassiveTaskFinished(passiveTaskFinishedSubscriber);
    temporaryScheduler.subscribePassiveTaskCheckFinished(passiveTaskCheckFinishedSubscriber);
    temporaryScheduler.subscribeRecipeFinished(recipeFinishedSubscriber);
    temporaryScheduler.subscribeProgress(progressSubscriber);
    setAssignedTasks(temporaryScheduler.getTasks());
    setPassiveTasks(temporaryScheduler.getPassiveTasks());

    setProgress(temporaryScheduler.getProgress())

    let _userNotifications = new Map<string, boolean>();
    temporaryScheduler
      .getTasks()
      .forEach((task, user) =>
        _userNotifications.set(user, task !== undefined && user !== activeUser)
      );
    setUserNotifications(new Map(_userNotifications));
    setScheduler(temporaryScheduler);

    return () => {
      console.log("UNSUBSCRIBING");
      temporaryScheduler.unsubscribeTaskAssigned(taskAssignedSubscriber);
      temporaryScheduler.unsubscribePassiveTaskStarted(
        passiveTaskStartedSubscriber
      );
      temporaryScheduler.unsubscribePassiveTaskFinished(
        passiveTaskFinishedSubscriber
      );
      temporaryScheduler.unsubscribePassiveTaskCheckFinished(
        passiveTaskCheckFinishedSubscriber
      );
      temporaryScheduler.unsubscribeRecipeFinished(recipeFinishedSubscriber);
      temporaryScheduler.unsubscribeProgress(progressSubscriber);
    };
  }, []);

  useEffect(() => {
    setActiveTask(assignedTasks.get(activeUser));
    // För tillfället den enda task som inte går att avsluta
    if (assignedTasks.get(activeUser) === helpOrRestTaskID) {
      setTaskConfirmType("unavailable");
    } else if (assignedTasks.get(activeUser)) {
      setTaskConfirmType("finish");
    } else {
      //om ett task är undefined/"du har paus", så visas en grå knapp
      setTaskConfirmType("unavailable");
    }
  }, [assignedTasks, activeUser]);

  // Fixar så det inte står en notis på den aktiva användaren
  if (undefinedToBoolean(userNotifications.get(activeUser))) {
    setUserNotifications(
      (notifications) => new Map(notifications.set(activeUser, false))
    );
  }

  // undoar activeUsers senaste avklarade task
  const undo = () => {
    const user = activeUser;
    const task = lastFinishedTask.get(user);
    if (task && scheduler) {
      setUndoData(
        (old) => {
          clearTimeoutOrUndefined(old.get(user)?.timeout);
          return new Map(old.set(user, { available: false }));
        }
      )
      scheduler.undo(task, user);
    }
  };

  // undo knapp
  let undoButton = <></>;

  if (undoData.get(activeUser)?.available) {
    // Vi kollar inte `okToPress` på den här `onPress` för personer kanske vilja undo:a på direkten
    undoButton = <View style={styles.undoContainer}><UndoButton onPress={undo}/></View>
  }

  // Visar undo knapp i 15 sec efter lastFinishedTask uppdaterats
  useEffect(() => {
    if (lastFinishedTask.get(activeUser)) {
      const oldData = undoData.get(activeUser);
      if (oldData && oldData.timeout) {
        clearTimeout(oldData.timeout);
      }
      const removeUndoBtnTimeout = setTimeout(
        () =>
          setUndoData(
            (old) => new Map(old.set(activeUser, { available: false }))
          ),
        15000
      );
      setUndoData(
        (old) =>
          new Map(
            old.set(activeUser, { available: true, timeout: removeUndoBtnTimeout })
          )
      );
      return () => clearTimeout(removeUndoBtnTimeout);
    }
  }, [lastFinishedTask]);

  if (scheduler) {
    // Skapa rätt knappars
    let taskConfirmButtons;
    switch (taskConfirmType) {
      case "finish":
        taskConfirmButtons = (
          <TaskConfirm
            confirmType={taskConfirmType}
            onFinishPress={() => {
              if (okToPress) {
                const task = activeTask;
                setAssignedTasks((assigned) => {
                  assigned.delete(activeUser);
                  return new Map(assigned);
                });
                if (task) {
                  scheduler.finishTask(task, activeUser);
                  setLastFinishedTask(
                    (last) => new Map(last.set(activeUser, task))
                  );
                }

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

    let timersComponent: JSX.Element;
    if (earliestInstr) {
      timersComponent = (
        <View
          style={{
            justifyContent: "center",
            marginLeft: 10,
            maxWidth: "70%",
          }}
        >
          <CookingTimer
            onPress={() => setTimerModalVisible(true)}
            finish={earliestTimer}
            displayRemainingTime="shown"
            size="small"
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
            }}
          >
            {earliestInstr}
          </Text>
        </View>
      );
    } else {
      timersComponent = (
        <View
          style={{
            justifyContent: "center",
            marginLeft: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "gray",
            }}
          >
            Inga timers just nu
          </Text>
        </View>
      );
    }

    let clockImage: JSX.Element;
    if (passiveTasks.size > 1) {
      clockImage = (
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/image/time_icon.png")}
            style={[styles.smallIcon, { marginRight: -23, zIndex: 1 }]}
          />
          <Image
            source={require("../../assets/image/time_icon.png")}
            style={[styles.smallIcon, { zIndex: 0 }]}
          />
        </View>
      );
    } else {
      clockImage = (
        <View>
          <Image
            source={require("../../assets/image/time_icon.png")}
            style={styles.smallIcon}
          />
        </View>
      );
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
                passiveTasks={passiveTasks}
                recipe={recipe}
                endTimer={(taskId: string) => {
                  scheduler.finishPassiveTask(taskId);
                  if (visiblePassiveTasks.length == 0)
                    setTimerModalVisible(false);
                }}
                extendTimer={(taskId: string) => {
                  scheduler.extendPassive(taskId);
                }}
                closeModal={() => {
                  setTimerModalVisible(false);
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexGrow: 1,
              /*styles.timerContainer*/
            }}
          >
            <Pressable
              onPress={() => setTimerModalVisible(true)}
              style={{
                margin: 10,
                height: 60,
                maxWidth: "100%",
                padding: 5,
                borderWidth: 2,
                // borderColor: "rgb(197, 197, 196)",
                // borderColor: "rgb(223, 223, 223)",
                borderColor: "rgb(243, 243, 243)",
                borderRadius: 15,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  padding: 0,
                  paddingLeft: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor: "red",
                }}
              >
                <View>{clockImage}</View>
              </View>

              {timersComponent}
            </Pressable>
          </View>
          <View
            style={{
              marginRight: 10,
              marginTop: 10,
              /*styles.topBarRightMenu*/
            }}
          >
            <Pressable onPress={() => navigation.navigate("SessionStart", {})}>
              <Image
                source={require("../../assets/image/showMenuButton_icon.png")} // TODO: Placeholder tills ikon finns
                style={styles.topBarRightMenuIcon}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("CookingOverview", {users: users})}>
              <Image
                source={require("../../assets/image/showMenuButton_icon.png")} // TODO: Placeholder tills ikon finns
                style={styles.topBarRightMenuIcon}
              />
            </Pressable>
          </View>
        </View>
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
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.spacingWithNoContent} />

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
        </View>
        <View style={styles.buttonContainer}>
          {undoButton}  
          {taskConfirmButtons}
          
        </View>
        <View style={{flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", paddingBottom: 20}}>
          <View style={{width: "10%"}}></View>
          <Progress.Bar color="green" height={15} unfilledColor="lightgrey" borderWidth={0} progress={progress} width={null} style={{width:"80%"}}/>
          <Text style={{width: "10%", paddingLeft: 5 }}>{Math.round(progress*100)}%</Text>
        </View>
        
        
      </SafeAreaView>
    );
  }
  return <></>;
}

const SMALL_ICON_SIZE = 30;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  modalScreenContainer: {
    flex: 1,
    alignItems: "center",

    justifyContent: "flex-start",
    backgroundColor: "rgba(160, 160, 160, 0.5)",
  },
  timerModalContainer: {
    height: "85%",
    maxHeight: "84%", //"66.5%",
    width: "95%",
    marginTop: 55, //90,
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
     width: 30,
     height: 35,
    // padding: 5, 
    margin: 6,
    marginTop: 9,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    
    width: "100%",
  },
  activeTaskCardContainer: {
    width: "95%",
    marginVertical: 20,
  },
  spacingWithNoContent: {
    height: "0%",
  },
  minimizedTasksFlatListContainer: {
    width: "95%",
    height: "23%",
  },
  timerContainer: {
    position: "absolute",
    top: 2,
    left: 20,
  },
  buttonContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  undoContainer: {
    height: 80,
    width: 80,
    position: "absolute",
    left: 25,
    paddingTop: 17,

    marginHorizontal: 10,
    top: "auto",
  },
  smallIcon: {
    height: SMALL_ICON_SIZE,
    width: SMALL_ICON_SIZE,
  },
});

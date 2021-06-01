import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { CookingTimer } from "./CookingTimer";
import { Recipe, Task } from "../data";
import { unsafeFind } from "../utils";
import { StandardButton } from "./StandardButton";

type Props = {
  passiveTasks: Map<string, Date>;
  recipe: Recipe;
  endTimer: (taskId: string) => void;
  extendTimer: (taskId: string) => void;
  closeModal: () => void;
};

export function CookingTimerOverview({
  passiveTasks,
  recipe,
  endTimer,
  extendTimer,
  closeModal,
}: Props) {
  let passiveTaskIds: string[] = Array.from(passiveTasks.keys());

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",

          justifyContent: "space-between",
          alignItems: "flex-start",
          // backgroundColor: "red",
          height: 50,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "red",
            flexDirection: "row",

            flex: 1,
          }}
        >
          <View
            style={{
              margin: 10,
              height: 30,
              width: 30,
              // paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            <Image
              source={require("../../assets/image/time_icon.png")}
              style={styles.smallIcon}
            ></Image>
          </View>

          <Text
            style={{
              fontSize: 32,
            }}
          >
            Timers
          </Text>
          <Pressable
            onPress={closeModal}
            style={{
              padding: 15,
              // backgroundColor: "red",
              alignSelf: "flex-end",
            }}
          >
            <Image
              // TODO: add close-button icon, maybe a cross?

              source={require("../../assets/image/cross_icon.png")}
              style={{
                height: 20,
                width: 20,
              }}
            ></Image>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "rgba(160, 160, 160, 0.5)",
          marginHorizontal: 10,
        }}
      ></View>
      {passiveTaskIds.length > 0 ? (
        <View>
          <FlatList
            data={passiveTaskIds}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <PassiveTaskCard
                taskId={item}
                recipe={recipe}
                finish={passiveTasks.get(item)}
                onPress={() => endTimer(item)}
                extendTimer={() => extendTimer(item)}
              />
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginVertical: 10,
                  height: 2,
                  backgroundColor: "rgb(223, 223, 223)",
                }}
              />
            )}
            contentContainerStyle={styles.cardListContainer}
          />

          <View
            style={{
              marginHorizontal: 10,
              height: 2,
              backgroundColor: "rgb(223, 223, 223)",
            }}
          ></View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              alignSelf: "center",
            }}
          >
            Inga timers just nu
          </Text>
        </View>
      )}
    </View>
  );
}

type PassiveTaskCardProps = {
  taskId: string;
  recipe: Recipe;
  finish: Date | undefined;
  onPress: () => void;
  extendTimer: () => void;
};

const PassiveTaskCard = ({
  taskId,
  recipe,
  finish,
  onPress,
  extendTimer,
}: PassiveTaskCardProps) => {
  if (finish) {
    console.log("WHAT IS FINISH ", typeof finish)
    let [isFinished, setIsFinished] = useState(finish.getTime() < Date.now());

    return (
      <View
        style={{
          flexDirection: "column",
          height: 200,
          marginBottom: 3,
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,

            justifyContent: "space-between",
            alignItems: "flex-start",
            // backgroundColor: "red",
            height: 30,
          }}
        >
          {/* TODO: Fixa så att timern är alignad till vänster, så den inte flyttar på sig när den går ner. */}
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginHorizontal: 10,
              // backgroundColor: "hotpink",
            }}
          >
            <CookingTimer
              size="large"
              finish={finish}
              displayRemainingTime={"shown"}
              onTimerComplete={() => setIsFinished(true)}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            <StandardButton
              onPress={() => {
                extendTimer();
                setIsFinished(false);
              }}
              buttonText="Förläng timer"
              buttonType="secondary"
            />
          </View>
        </View>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 2,
            minHeight: 100,
            // backgroundColor: "red",
            justifyContent: "flex-start",
          }}
        >
          <Text style={styles.taskText}>
            {
              unsafeFind(recipe.tasks, (t: Task) => t.id === taskId)
                .instructions
            }
          </Text>
        </View>

        {/* 
        TODO: Ifall timern är klar, buttonText= "Klar"
        */}
        {/* TODO: Antagligen inte vara grön om det är avbryt i förtid, bara när det står "Klar" */}
        <StandardButton
          style={{ justifyContent: "flex-end" }}
          buttonType={isFinished ? "primary" : "secondary"}
          onPress={onPress}
          buttonText={isFinished ? "Färdigt" : "Avbryt timer i förtid"}
        />
      </View>
      // <Pressable onPress={onPress}>
      //   {({ pressed }) => (
      //     <View
      //       style={[
      //         styles.cardContainer,
      //         pressed ? styles.pressedCardColor : styles.cardColor,
      //       ]}
      //     >
      //       <CookingTimer finish={finish} displayRemainingTime={"shown"} />
      //       <Text style={styles.taskText} numberOfLines={1}>
      //         {unsafeFind(recipe.tasks, (t: Task) => t.id === taskId).name}
      //       </Text>
      //     </View>
      //   )}
      // </Pressable>
    );
  }
  return <></>;
};

const SMALL_ICON_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 10,
  },
  headerContainer: {
    paddingTop: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardListContainer: {
    padding: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  smallIcon: {
    height: SMALL_ICON_SIZE,
    width: SMALL_ICON_SIZE,
  },
  taskText: {
    fontSize: 26,
    flexGrow: 1,
    // backgroundColor: "blue",

    paddingHorizontal: 10,
  },
  pressedCardColor: {
    backgroundColor: "lightgray",
  },
  cardColor: {
    backgroundColor: "whitesmoke",
  },
});

import React from "react";
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
  onPress: (taskId: string) => void;
  extendTimer: (taskId: string) => void;
};

export function CookingTimerOverview({
  passiveTasks,
  recipe,
  onPress,
  extendTimer,
}: Props) {
  let passiveTaskIds: string[] = Array.from(passiveTasks.keys());

  return (
    <View style={styles.container}>
      {passiveTaskIds.length > 0 ? (
        <FlatList
          data={passiveTaskIds}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <PassiveTaskCard
              taskId={item}
              recipe={recipe}
              finish={passiveTasks.get(item)}
              onPress={() => onPress(item)}
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
    return (
      <View
        style={{
          flexDirection: "column",
          height: 250,
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
          <View
            style={{
              padding: 10,
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
          {/* TODO: Fixa så att timern är alignad till vänster, så den inte flyttar på sig när den går ner. */}
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
              backgroundColor: "hotpink",
            }}
          >
            <CookingTimer
              size="large"
              finish={finish}
              displayRemainingTime={"shown"}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            {/* TODO: ändra onPress till något annat, dvs förläng timer ist. */}
            {/* TODO: Annan färg än standard button */}
            <StandardButton
              onPress={extendTimer}
              buttonText="Förläng timer"
              buttonType="secondary"
            />
          </View>
        </View>
        <View
          style={{
            margin: 2,
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
          onPress={onPress}
          buttonText="Avbryt timer i förtid"
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

const SMALL_ICON_SIZE = 35;

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
    fontSize: 28,
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

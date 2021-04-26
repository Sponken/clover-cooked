import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { CookingTimer } from "./CookingTimer";
import { Recipe, Task } from "../data";
import { unsafeFind } from "../utils";

type Props = {
  passiveTasks: Map<string, Date>;
  recipe: Recipe;
  onPress: (taskId: string) => void;
};

export function CookingTimerOverview({ passiveTasks, recipe, onPress }: Props) {
  let passiveTaskIds: string[] = Array.from(passiveTasks.keys());

  return (
    <View style={styles.container}>
      <FlatList
        data={passiveTaskIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <PassiveTaskCard
            taskId={item}
            recipe={recipe}
            finish={passiveTasks.get(item)}
            onPress={() => onPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        contentContainerStyle={styles.cardListContainer}
      />
    </View>
  );
}

type PassiveTaskCardProps = {
  taskId: string;
  recipe: Recipe;
  finish: Date | undefined;
  onPress: () => void;
};

const PassiveTaskCard = ({
  taskId,
  recipe,
  finish,
  onPress,
}: PassiveTaskCardProps) => {
  if (finish) {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <CookingTimer
            size="large"
            finish={finish}
            displayRemainingTime={"shown"}
          />
          <Text>"TODO: lägg Knapp här"</Text>
        </View>

        <Text style={styles.taskText} numberOfLines={1}>
          {unsafeFind(recipe.tasks, (t: Task) => t.id === taskId).instructions}
        </Text>

        <Pressable
          // knapp för att säga att timern är klar
          onPress={onPress}
          style={styles.button}
        ></Pressable>
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
  button: {
    borderRadius: 8,
    height: 70,
    width: 160,
    marginHorizontal: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  taskText: {
    fontSize: 24,
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

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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Pågående timers</Text>
      </View>
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
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={[
              styles.cardContainer,
              pressed ? styles.pressedCardColor : styles.cardColor,
            ]}
          >
            <CookingTimer finish={finish} displayRemainingTime={"shown"} />
            <Text style={styles.taskText} numberOfLines={1}>
              {unsafeFind(recipe.tasks, (t: Task) => t.id === taskId).name}
            </Text>
          </View>
        )}
      </Pressable>
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
    paddingTop: 10,
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
  taskText: {
    paddingHorizontal: 10,
  },
  pressedCardColor: {
    backgroundColor: "lightgray",
  },
  cardColor: {
    backgroundColor: "whitesmoke",
  },
});

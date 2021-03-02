import React from "react";
import {
  Recipe,
  Task as TaskType,
  IngredientUsage,
  getIngredientName,
  getIngredientUnit,
} from "../data";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";

type TaskProps = {
  task: TaskType;
  recipe: Recipe;
  onCompletePress: () => void;
};

/**
 * Komponent för att visa en användares uppgift
 */
export const Task = ({ task, recipe, onCompletePress }: TaskProps) => (
  <View style={styles.container}>
    <View style={styles.taskInfoContainer}>
      <Text style={styles.name}>{task.name}</Text>
      <Text style={styles.instructions}>{task.instructions}</Text>
      <FlatList
        style={styles.ingredientsContainer}
        data={task.ingredients}
        keyExtractor={(item) => item.ingredientId}
        renderItem={({ item }) => (
          <Ingredient ingredient={item} recipe={recipe} />
        )}
      />
    </View>
    <Button onPress={onCompletePress} title="Färdig!" />
  </View>
);

type IngredientsProps = {
  ingredient: IngredientUsage;
  recipe: Recipe;
};

/**
 * Komponent för att visa ingredienser i ingredienslistan
 */
const Ingredient = ({ ingredient, recipe }: IngredientsProps) => (
  <View style={styles.ingredientContainer}>
    <Text style={styles.ingredientName}>
      {getIngredientName(ingredient.ingredientId, recipe)}
    </Text>
    <Text>
      {ingredient.amount +
        " " +
        getIngredientUnit(ingredient.ingredientId, recipe)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    marginVertical: 3,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    backgroundColor: "#FFFFF0",
    borderRadius: 10,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    // Android shadow
    elevation: 4,
  },
  taskInfoContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 10,
    marginTop: 2,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 20,
  },
  ingredientsContainer: {
    marginLeft: 10,
  },
  ingredientName: {
    fontSize: 15,
    marginRight: 7,
  },
  ingredientContainer: {
    flex: 1,
    flexDirection: "row",
  },
  ingredientAmount: {
    fontSize: 15,
  },
});

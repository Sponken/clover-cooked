import React from "react";
import { ColorValue } from "react-native";
import {
  Recipe,
  Task as TaskType,
  IngredientUsage,
  getIngredientName,
  getIngredientUnit,
} from "../data";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { unsafeFind } from "../utils";

type TaskCardProps = {
  taskId: string | undefined;
  recipe: Recipe;
  userName: string;
  userColor: ColorValue;
  minimized?: boolean;
};

/**
 * Komponent för att visa en användares uppgift
 */
export const TaskCard = ({
  taskId,
  recipe,
  userName,
  userColor,
  minimized,
}: TaskCardProps) => {
  let task: TaskType;
  if (taskId) {
    task = unsafeFind(recipe.tasks, (o: TaskType) => o.id == taskId);
  } else {
    task = {
      id: "__FÄRDIG__",
      name: "Det finns inget att göra just nu",
      instructions: "Diska om det går, vila annars!",
      ingredients: [],
      resources: [],
      estimatedTime: 9999,
    };
  }

  let userIndicator: JSX.Element;
  let userNameComponent: JSX.Element;
  let infoComponent: JSX.Element;
  let instructionsComponent: JSX.Element;
  let ingredientComponent: JSX.Element;
  if (task.passive) {
    userIndicator = (
      <Image
        source={require("../../assets/image/time_icon.png")}
        style={styles.passiveTaskIcon}
      />
    );
    userNameComponent = <></>;
  } else {
    userIndicator = <UserColorIndicator color={userColor} />;
    userNameComponent = (
      <Text numberOfLines={1} style={[styles.userName, { color: userColor }]}>
        {userName}
      </Text>
    );
  }
  if (minimized) {
    infoComponent = (
      <View style={styles.taskNameContainer}>
        <Text style={styles.taskName}>{task.name}</Text>
      </View>
    );
  } else {
    instructionsComponent = (
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>{task.instructions}</Text>
      </View>
    );
    if (task.passive) {
      ingredientComponent = <></>;
    } else {
      ingredientComponent = (
        <FlatList
          style={styles.ingredientsContainer}
          data={task.ingredients}
          keyExtractor={(item) => item.ingredientId}
          renderItem={({ item }) => (
            <Ingredient ingredient={item} recipe={recipe} />
          )}
        />
      );
    }
    infoComponent = (
      <View>
        {instructionsComponent}
        {ingredientComponent}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        minimized ? styles.minimizedContainerColor : styles.baseContainerColor,
      ]}
    >
      {userIndicator}
      <View style={styles.taskBody}>
        {userNameComponent}
        <View style={styles.taskInfoContainer}>{infoComponent}</View>
      </View>
    </View>
  );
};

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

type UserColorIndicatorProps = {
  color: ColorValue;
};

/**
 * Komponent för att visa en användares färg i task kortet
 */
const UserColorIndicator = ({ color }: UserColorIndicatorProps) => (
  <View style={[styles.userColorIndicator, { backgroundColor: color }]} />
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    margin: 10,
    padding: 10,
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
  baseContainerColor: {
    backgroundColor: "white",
  },
  minimizedContainerColor: {
    backgroundColor: "lightgrey",
  },

  userColorIndicator: {
    width: 6,
    borderRadius: 2.2,
    alignSelf: "stretch",
  },
  passiveTaskIcon: {
    width: 10,
    height: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 12,
  },
  taskBody: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 5,
  },
  taskInfoContainer: {
    //flex: 1,
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 5,
    marginVertical: 5,
  },
  taskNameContainer: {
    marginBottom: 5,
  },
  taskName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  instructions: {
    fontSize: 20,
  },
  instructionsContainer: {
    marginBottom: 5,
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

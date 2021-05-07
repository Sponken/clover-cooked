import React from "react";
import { ColorValue } from "react-native";
import {
  Recipe,
  Task as TaskType,
  IngredientUsage,
  getIngredientName,
  getIngredientUnit,
  isIdleTaskID,
  getIdleTask,
} from "../data";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { unsafeFind } from "../utils";

const NOTIFICATTION_DOT_SIZE = 15;

type TaskCardProps = {
  taskId: string | undefined;
  recipe: Recipe;
  userName: string;
  userColor: ColorValue;
};

/**
 * Komponent för att visa en användares uppgift
 */
export const TaskCard = ({
  taskId,
  recipe,
  userName,
  userColor
}: TaskCardProps) => {
  let task: TaskType;
  if (taskId && isIdleTaskID(taskId)) {
    task = getIdleTask(taskId);
  } else if (taskId) {
    task = unsafeFind(recipe.tasks, (o: TaskType) => o.id == taskId);
  } else {
    return <></>;
  }

  let userIndicator: JSX.Element;
  let userNameComponent: JSX.Element;
  let infoComponent: JSX.Element;
  let instructionsComponent: JSX.Element;
  let ingredientComponent: JSX.Element;
  let branchComponent: JSX.Element;

  /**
   * För alla task som visas vill vi sätta userNameComponent, userIndicatorComponent
   * och infoComponent
   */
  userNameComponent = (
    <Text numberOfLines={1} style={[styles.userName, { color: userColor }]}>
      {userName}
    </Text>
  );
  let branch = task.branch;
  if (branch) {
    branchComponent = (
      <View style={styles.branchContainer}>
        <View style={{width: 10, height: 15, marginRight: 5}}>
          <Image
            style={{maxWidth: "100%", maxHeight: "100%"}}
            source={require("../../assets/image/branch.png")}
          />
        </View>
        <Text >{task.branch}</Text>
      </View>
    )
  } else {
    branchComponent = <></>;
  }
  userIndicator = <UserColorIndicator color={userColor} />;

  instructionsComponent = (
    <View style={styles.instructionsContainer}>
      <Text style={styles.bigText}>{task.instructions}</Text>
    </View>
  );
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
  infoComponent = (
    <View>
      {instructionsComponent}
      {ingredientComponent}
    </View>
  );

  return (
    <View style={styles.taskCompleteContainer}>
      <View
        style={[
          styles.taskContainer,
          styles.baseContainerColor,
        ]}
      >
        {userIndicator}
        <View style={styles.taskBody}>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            {userNameComponent}
            {branchComponent}
          </View>
          <View style={styles.taskInfoContainer}>{infoComponent}</View>
        </View>
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
    <Text style={styles.ingredientName}>
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
  branchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  taskCompleteContainer: {
    width: "100%",
  },
  taskContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginTop: NOTIFICATTION_DOT_SIZE / 2.5,
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
    paddingVertical: 20,
  },
  userColorIndicator: {
    width: 6,
    borderRadius: 2.2,
    alignSelf: "stretch",
  },
  passiveTaskIconActive: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15,
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
  normalText: {
    fontSize: 15,
  },
  bigText: {
    paddingTop: 5,
    lineHeight: 30, //25,
    fontSize: 25,
    fontWeight: "400",
  },
  instructionsContainer: {
    marginBottom: 5,
  },
  ingredientsContainer: {
    marginLeft: 10,
  },
  ingredientName: {
    fontSize: 22,
    marginRight: 7,
    fontWeight: "300",
  },
  ingredientContainer: {
    flex: 1,
    flexDirection: "row",
  },
  ingredientAmount: {
    fontSize: 15,
  },
});

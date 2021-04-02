import React from "react";
import { ColorValue, ImageBackground } from "react-native";
import {
  Recipe,
  Task as TaskType,
  IngredientUsage,
  getIngredientName,
  getIngredientUnit,
} from "../data";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { unsafeFind } from "../utils";

const NOTIFICATTION_DOT_SIZE = 15;

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

  /**
   * För alla task som visas vill vi sätta userNameComponent, userIndicatorComponent
   * och infoComponent
   */
  //litet task
  if (minimized) {
    userNameComponent = <></>;
    infoComponent = <Text style={styles.normalText}>{task.name}</Text>;
    //litet och passivt
    if (task.passive) {
      userIndicator = (
        <Image
          source={require("../../assets/image/time_icon.png")}
          style={styles.passiveTaskIconInactive}
        />
      );
    }
    //litet och tilldelat
    else {
      userIndicator = <UserColorIndicator color={userColor} />;
    }
  }
  //stort task
  else {
    userNameComponent = (
      <Text numberOfLines={1} style={[styles.userName, { color: userColor }]}>
        {userName}
      </Text>
    );
    userIndicator = <UserColorIndicator color={userColor} />;
    //stort och passivt
    if (task.passive) {
      instructionsComponent = (
        <View style={styles.instructionsContainer}>
          <View style={styles.passiveTaskExplanationContainer}>
            <Image
              source={require("../../assets/image/time_icon.png")}
              style={styles.passiveTaskIconActive}
            />
            <Text style={styles.normalText}>{task.instructions}</Text>
          </View>
          <Text style={styles.bigText}>Är det klart?</Text>
        </View>
      );
      ingredientComponent = <></>;
    }
    //stort och aktivt
    else {
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
    }
    infoComponent = (
      <View>
        {instructionsComponent}
        {ingredientComponent}
      </View>
    );
  }

  return (
    <View style={styles.taskCompleteContainer}>
      <View
        style={[
          styles.taskContainer,
          minimized
            ? styles.minimizedContainerColorAndWidth
            : styles.baseContainerColor,
        ]}
      >
        {userIndicator}
        <View style={styles.taskBody}>
          {userNameComponent}
          <View style={styles.taskInfoContainer}>{infoComponent}</View>
        </View>
      </View>
      <View style={styles.notificationContainer}>
        <Notification visable={task.passive && minimized} />
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

type NotificationProps = {
  visable: boolean | undefined;
};
const Notification = ({ visable }: NotificationProps) => (
  <View
    style={[
      styles.notificationDot,
      visable ? styles.notificationDotVisable : styles.notificationDotInvisable,
    ]}
  />
);

const styles = StyleSheet.create({
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
  minimizedContainerColorAndWidth: {
    backgroundColor: "#dedede",
    opacity: 0.7,
    width: "98.7%",
  },
  userColorIndicator: {
    width: 6,
    borderRadius: 2.2,
    alignSelf: "stretch",
  },
  passiveTaskIconInactive: {
    width: 15,
    height: 15,
  },
  passiveTaskIconActive: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  passiveTaskExplanationContainer: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#ebebeb",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
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
    fontSize: 25,
    fontWeight: "600",
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
  notificationContainer: {
    elevation: 5, //för android så den ligger högst upp
    position: "absolute",
    right: 0,
    top: 0,
  },
  notificationDot: {
    borderRadius: NOTIFICATTION_DOT_SIZE / 2,
    width: NOTIFICATTION_DOT_SIZE,
    height: NOTIFICATTION_DOT_SIZE,
    overflow: "hidden",
  },
  notificationDotVisable: {
    backgroundColor: "red",
  },
  notificationDotInvisable: {},
});

import React from "react";
import { StyleSheet, View } from "react-native";
import { StandardButton } from "./StandardButton";

export type TaskConfirmType =
  | "finish"
  | "extendOrFinish"
  | "interruptOrContinue"
  | "unavailable";

type TaskConfirmProps = {
  onFinishPress?: () => void;
  onExtendPress?: () => void;
  onContinuePress?: () => void;
  confirmType: TaskConfirmType;
};

/**
 * Knappar för bekräfta task
 * confirmType: "finish" används för "vanlig" uppgift som endast kan avslutas
 * confirmType: "extendOrFinish" används för att antingen förlänga eller avluta en passiv (timer) uppgift
 * confirmType: "interruptOrContiue" används för att avluta eller fortsätta en passiv (timer) uppgift
 */
export const TaskConfirm = ({ confirmType, ...props }: TaskConfirmProps) => {
  switch (confirmType) {
    case "finish":
      return (
        <View style={styles.buttonContainer}>
          <StandardButton
            buttonText={"Klar"}
            buttonType={"primary"}
            onPress={props.onFinishPress}
            textProps={{ textWeight: "bold" }}
          />
        </View>
      );
    case "extendOrFinish":
      return (
        <View style={styles.buttonContainer}>
          <StandardButton
            buttonText={"Förläng timer"}
            buttonType={"secondary"}
            onPress={props.onExtendPress}
          />
          <View style={{ width: 50 }} />
          <StandardButton
            buttonText={"Klar"}
            buttonType={"primary"}
            onPress={props.onFinishPress}
          />
        </View>
      );
    case "interruptOrContinue":
      return (
        <View style={styles.buttonContainer}>
          <StandardButton
            buttonText={"Stäng av \n i förväg"}
            textNumbOfLines={2}
            buttonType={"secondary"}
            onPress={props.onFinishPress}
          />
          <View style={{ width: 50 }} />
          <StandardButton
            buttonText={"Låt timern \n fortsätta"}
            textNumbOfLines={2}
            buttonType={"primary"}
            onPress={props.onContinuePress}
          />
        </View>
      );
    case "unavailable":
      return (
        <View style={styles.buttonContainer}>
          <StandardButton
            buttonText={"Klar"}
            buttonType={"passive"}
            onPress={props.onFinishPress}
            textProps={{ textWeight: "bold" }}
          />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});

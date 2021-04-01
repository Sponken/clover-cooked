import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

export type TaskConfirmType = "finish" | "extendOrFinish" | "finishOrContinue";

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
          <Button text="Klar" type="confirm" onPress={props.onFinishPress} />
        </View>
      );
    case "extendOrFinish":
      return (
        <View style={styles.buttonContainer}>
          <Button
            text="Förläng timer"
            type="deny"
            onPress={props.onExtendPress}
          />
          <Button text="Klar" type="confirm" onPress={props.onFinishPress} />
        </View>
      );
    case "finishOrContinue":
      return (
        <View style={styles.buttonContainer}>
          <Button
            text="Stäng av i förväg"
            type="deny"
            onPress={props.onFinishPress}
          />
          <Button
            text="Låt timer fortsätt"
            type="confirm"
            onPress={props.onContinuePress}
          />
        </View>
      );
  }
};

type ButtonProps = {
  text: string;
  type: "confirm" | "deny"; //confirm användas för fet tydlig knapp, deny används för sekundär knapp
  onPress: (() => void) | undefined;
};

/**
 * Knapparna som används i TaskConfirm
 */
const Button = ({ text, type, onPress }: ButtonProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => {
      let buttonColorStyle;
      let buttonTextStyle;
      if (type == "confirm") {
        buttonTextStyle = styles.buttonTextConfirm;
        if (pressed) {
          buttonColorStyle = styles.buttonConfirmPressed;
        } else {
          buttonColorStyle = styles.buttonConfirm;
        }
      } else {
        buttonTextStyle = styles.buttonTextDeny;
        if (pressed) {
          buttonColorStyle = styles.buttonDenyPressed;
        } else {
          buttonColorStyle = styles.buttonDeny;
        }
      }
      return (
        <View style={[styles.button, buttonColorStyle]}>
          <Text style={buttonTextStyle}>{text}</Text>
        </View>
      );
    }}
  </Pressable>
);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    borderRadius: 8,
    height: 70,
    width: 160,
    marginHorizontal: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",

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
  buttonTextConfirm: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonTextDeny: {
    fontSize: 20,
    color: "#38a13f",
  },
  buttonConfirm: {
    backgroundColor: "#38a13f",
  },
  buttonConfirmPressed: {
    backgroundColor: "#1d8c25",
  },
  buttonDeny: {
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#38a13f",
  },
  buttonDenyPressed: {
    backgroundColor: "#ebebeb",
    borderWidth: 3,
    borderColor: "#1d8c25",
  },
});

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { StandardText, StandardTextProps } from "./StandardText";
import { primaryColor, primaryColorVariant } from "./Colors";

type StandardButtonProps = {
  onPress: () => void,
  buttonText?: string,
  buttonType?: "primary" | "secondary",
  textProps?: StandardTextProps,
};

export function StandardButton({ ...props }: StandardButtonProps) {
  let buttonBackgroundColor;
  let buttonBackgroundColorPressed;
  let buttonTextColor;
  let buttonBorderColor;

  switch (props.buttonType ?? "primary"){
    case "primary":
      buttonBackgroundColorPressed = primaryColorVariant;
      buttonBackgroundColor = primaryColor;
      buttonTextColor = "white";
      buttonBorderColor= primaryColor;
      break;
    case "secondary":
      buttonBackgroundColorPressed = "lightgrey";
      buttonBackgroundColor = "white";
      buttonTextColor = "primary";
      buttonBorderColor = primaryColor;
      break;
  }

  return (
    <View>
      <Pressable onPress={props.onPress}>
        {({ pressed }) => {
          let buttonColor = pressed
            ? { backgroundColor: buttonBackgroundColorPressed }
            : { backgroundColor: buttonBackgroundColor };
          return (
            <View style={[styles.buttonStyle, buttonColor, {borderColor: buttonBorderColor}]}>
              <StandardText
                size="medium"
                color={buttonTextColor}
                {...props.textProps}
                text={props.buttonText}
              />
            </View>
          );
        }}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1.5,
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
});

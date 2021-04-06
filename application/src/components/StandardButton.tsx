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
  let buttonBorderWidth;
  let buttonTextColor;

  switch (props.buttonType ?? "primary"){
    case "primary":
      buttonBackgroundColor = primaryColorVariant;
      buttonBackgroundColorPressed = primaryColor;
      buttonTextColor = "white";
      break;
    case "secondary":
      buttonBackgroundColor = "lightgrey";
      buttonBackgroundColorPressed = "white";
      buttonTextColor = "primary";
      break;
  }

  return (
    <View>
      <Pressable onPress={props.onPress}>
        {({ pressed }) => {
          let buttonColor = pressed
            ? { backgroundColor: buttonBackgroundColor }
            : { backgroundColor: buttonBackgroundColorPressed };
          return (
            <View style={[styles.buttonStyle, buttonColor]}>
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
    borderColor: primaryColor,
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

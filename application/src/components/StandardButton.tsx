import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { StandardText, StandardTextProps } from "./StandardText";
import { primaryColor, primaryColorVariant } from "./Colors";

type StandardButtonProps = {
  onPress: () => void;
  buttonText?: string;
  textProps?: StandardTextProps;
};

export function StandardButton({ ...props }: StandardButtonProps) {
  return (
    <View>
      <Pressable onPress={props.onPress}>
        {({ pressed }) => {
          let buttonColor = pressed
            ? { backgroundColor: primaryColorVariant }
            : { backgroundColor: primaryColor };
          return (
            <View style={[styles.buttonStyle, buttonColor]}>
              <StandardText
                size="medium"
                color="white"
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
    padding: 10,
    borderRadius: 8,
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

import { useLinkProps } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { StandardText, StandardTextProps } from "./StandardText";

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
            ? { backgroundColor: "#b376ab" }
            : { backgroundColor: "hotpink" };
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
  touchableHighlight: {
    borderRadius: 5,
    margin: 10,
  },
  buttonPressed: {
    backgroundColor: "#b376ab",
  },
  buttonNotPressed: {
    backgroundColor: "hotpink",
  },
  buttonStyle: {
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 4,
  },
});

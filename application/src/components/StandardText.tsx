import React from "react";
import {
  Text,
  StyleSheet,
  ColorValue
} from "react-native";
import {primaryColor, secondaryColor} from "./Colors"



export type StandardTextProps = {
  size?: "small" | "medium" | "large",
  text?: string,
  color?: "primary" | "secondary" | "black" | "white",
  colorValue?: ColorValue 
  textWeight?: "normal" | "bold" | "lighter"
};

export function StandardText({ ...props }: StandardTextProps) {
  let sizeStyle;
  switch(props.size ?? "medium"){
    case "small":
      sizeStyle = {fontSize: 12};
      break;
    case "medium":
      sizeStyle = {fontSize: 22};
      break;
    case "large":
      sizeStyle = {fontSize: 40};
      break;

    }

    let colorStyle;
    if (!props.colorValue){
    switch(props.color ?? "black"){
      case "primary":
        colorStyle = {color: primaryColor};
        break;
      case "secondary":
        colorStyle = {color: secondaryColor}
        break;
      case "white":
        colorStyle = {color: "white"}
        break;
      case "black":
        colorStyle = {color: "black"}
        break;
    }
  }
    else{
      colorStyle = {color: props.colorValue.toString()}
    }

  let weightStyle = {fontWeight: props.textWeight ?? "normal"}

  return (
    <Text style={[sizeStyle, colorStyle, weightStyle, styles.textStyle]}>{props.text}</Text>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    //fontFamily: 'cursive',
    alignSelf: "center"
  },
});

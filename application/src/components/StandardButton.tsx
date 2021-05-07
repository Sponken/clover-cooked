import React from "react";
import { View, StyleSheet, Pressable, Image,ColorValue } from "react-native";
import { StandardText, StandardTextProps } from "./StandardText";
import { primaryColor, primaryColorVariant,passiveColor,passiveColorVariant } from "./Colors";

const CHEF_BUBBLE_SIZE = 54;

type StandardButtonProps = {
  onPress: () => void,
  buttonType?: "primary" | "secondary" | "passive" | "black" | "white" | "customColor",
  buttonColor?: ColorValue;
  buttonSize?: "normal" | "small" | "circleBig" | "square",
  buttonText?: string,
  buttonIcon?: Image,
  textProps?: StandardTextProps,
  textNumbOfLines?: number,
};

export function StandardButton({ ...props }: StandardButtonProps) {
  let buttonBackgroundColor;
  let buttonBackgroundColorPressed;
  let buttonTextColor;
  let buttonBorderColor;
  let buttonBorderColorPressed;

  switch (props.buttonType ?? "primary"){
    case "primary":
      buttonBackgroundColor = primaryColor;
      buttonBorderColor= primaryColor;
      buttonBackgroundColorPressed = primaryColorVariant;
      buttonBorderColorPressed = primaryColorVariant;
      buttonTextColor = "white";
      break;
    case "secondary":
      buttonBackgroundColor = "white";
      buttonBorderColor = primaryColor;
      buttonBackgroundColorPressed = "lightgrey";
      buttonBorderColorPressed = primaryColor;
      buttonTextColor = "primary";
      break;
    case "passive":
      buttonBackgroundColor = passiveColor;
      buttonBorderColor = passiveColor;
      buttonBackgroundColorPressed = passiveColorVariant;
      buttonBorderColorPressed = passiveColorVariant;
      buttonTextColor = "white";
      break;
      case "black":
        buttonBackgroundColor = "#292929";
        buttonBorderColor = "#292929";
        buttonBackgroundColorPressed = "#292929";
        buttonBorderColorPressed = "#292929";
        buttonTextColor = "white";
        break;
    case "white":
      buttonBackgroundColor = "white";
      buttonBorderColor = "white";
      buttonBackgroundColorPressed = "white";
      buttonBorderColorPressed = "white";
      buttonTextColor = "white";
      break;
    case "customColor":
      buttonBackgroundColor = props.buttonColor;
      buttonBorderColor = props.buttonColor;
      buttonBackgroundColorPressed = props.buttonColor;
      buttonBorderColorPressed = props.buttonColor;
      buttonTextColor = "white";
      break;
  }

  let buttonsSize;
  let buttonTextSize;
  switch (props.buttonSize ?? "normal"){
    case "normal":
      buttonsSize = {paddingVertical: 12, paddingHorizontal: 19, borderRadius: 8, borderWidth: 1.5,};
      buttonTextSize= "medium";
      break;
  case "small":
    buttonsSize = {padding: 7, borderRadius: 8, borderWidth: 1.5,};
    buttonTextSize = "SM";
    break;
  case "circleBig":
    buttonsSize = { height: CHEF_BUBBLE_SIZE, width: CHEF_BUBBLE_SIZE, borderRadius: 100,};
    buttonTextSize= "medium";
    break;
  case "square":
    buttonsSize = { padding: 7, height: 30, width: 30, borderRadius: 8, borderWidth: 1.5};
    buttonTextSize= "medium";
    break;
  

  }

  let buttonImage= <></>;;
  let spacingBetweenImageText = <></>
  if (props.buttonIcon !== undefined){
    buttonImage = props.buttonIcon;
    if (props.buttonText !== undefined){
    spacingBetweenImageText=<View style={{width:10}}/>}
  }


  return (
    <View>
      <Pressable onPress={props.onPress}>
        {({ pressed }) => {
          let buttonColor = pressed
            ? { backgroundColor: buttonBackgroundColorPressed, borderColor: buttonBorderColorPressed}
            : { backgroundColor: buttonBackgroundColor, borderColor: buttonBorderColor };
          return (
            <View style={[ styles.buttonStyle, buttonColor, buttonsSize,]}>
              <View>{buttonImage}</View>
              {spacingBetweenImageText}
              <StandardText
                size={buttonTextSize}
                color={buttonTextColor}
                {...props.textProps}
                text={props.buttonText}
                textNumbOfLines={props.textNumbOfLines}
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
    flexDirection: "row",
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
